import { parse, stringify } from 'qs';
import { groupByAnd, Query, tagKey } from './query';

export interface AzureFilters {
  subscription_guid?: string | number;
  limit?: number;
  offset?: number;
  resolution?: 'daily' | 'monthly';
  service_name?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type AzureGroupByValue = string | string[];

interface AzureGroupBys {
  service_name?: AzureGroupByValue;
  subscription_guid?: AzureGroupByValue;
  instance_type?: AzureGroupByValue;
  resource_location?: AzureGroupByValue;
}

interface AzureOrderBys {
  subscription_guid?: string;
  resource_location?: string;
  service_name?: string;
  cost?: string;
  usage?: string;
}

export interface AzureQuery extends Query {
  delta?: string;
  filter?: AzureFilters;
  group_by?: AzureGroupBys;
  order_by?: AzureOrderBys;
  key_only?: boolean;
}

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getLogicalAnd(query: AzureQuery) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    newQuery.group_by[`${groupByAnd}${key}`] = query.group_by[key];
    newQuery.group_by[key] = undefined;
  }
  return newQuery;
}

// Converts filter_by to group_by
export function getGroupBy(query: AzureQuery) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    newQuery.group_by[key] = query.filter_by[key];
  }
  return newQuery;
}

// Skip adding logical AND
export function getQueryRoute(query: AzureQuery) {
  return stringify(query, { encode: false, indices: false });
}

// Adds logical AND
export function getQuery(query: AzureQuery) {
  const newQuery = getGroupBy(query);
  let isGroupByAnd = false;

  // Workaround for https://github.com/project-koku/koku/issues/1596
  if (newQuery && newQuery.group_by) {
    const keys = Object.keys(newQuery.group_by);
    if (keys && keys.length > 1) {
      isGroupByAnd = true;
    } else {
      // Find a tag (#1596) or group_by with multiple keys
      for (const key of keys) {
        if (
          (Array.isArray(newQuery.group_by[key]) &&
            newQuery.group_by[key].length > 1) ||
          key.indexOf(tagKey) !== -1
        ) {
          isGroupByAnd = true;
        }
      }
    }
  }

  // Skip logical AND for single group_by
  const q = isGroupByAnd ? getLogicalAnd(newQuery) : newQuery;
  return stringify(q, { encode: false, indices: false });
}

// Removes logical AND from filter_by
export function parseFilterByAnd(query: AzureQuery) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    const index = key.indexOf(groupByAnd);
    const filterByKey =
      index !== -1 ? key.substring(index + groupByAnd.length) : key;
    newQuery.filter_by[filterByKey] = query.filter_by[key];
  }
  return newQuery;
}

// Removes logical AND from group_by -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByAnd(query: AzureQuery) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    const index = key.indexOf(groupByAnd);
    const groupByKey =
      index !== -1 ? key.substring(index + groupByAnd.length) : key;
    newQuery.group_by[groupByKey] = query.group_by[key];
  }
  return newQuery;
}

export function parseQuery<T = any>(query: string): T {
  const newQuery = parse(query, { ignoreQueryPrefix: true });
  return parseFilterByAnd(parseGroupByAnd(newQuery));
}
