import { parse, stringify } from 'qs';

export interface AzureFilters {
  account?: string | number;
  limit?: number;
  offset?: number;
  resolution?: 'daily' | 'monthly';
  service?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type AzureGroupByValue = string | string[];

interface AzureGroupBys {
  service?: AzureGroupByValue;
  account?: AzureGroupByValue;
  instance_type?: AzureGroupByValue;
  region?: AzureGroupByValue;
}

interface AzureOrderBys {
  account?: string;
  region?: string;
  service?: string;
  cost?: string;
  usage?: string;
}

export interface AzureQuery {
  delta?: string;
  filter?: AzureFilters;
  group_by?: AzureGroupBys;
  order_by?: AzureOrderBys;
  key_only?: boolean;
}

const groupByAnd = 'and:';

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getGroupByAnd(query: AzureQuery) {
  if (!(query && query.group_by) || skipGroupByAnd(query)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    if (query.group_by[key] === '*') {
      newQuery.group_by[key] = query.group_by[key];
    } else {
      newQuery.group_by[`${groupByAnd}${key}`] = query.group_by[key];
    }
  }
  return newQuery;
}

export function getQuery(query: AzureQuery) {
  const newQuery = getGroupByAnd(query);
  return stringify(newQuery, { encode: false, indices: false });
}

// Removes logical AND from group_by -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByAnd(query: AzureQuery) {
  if (!(query && query.group_by) || skipGroupByAnd(query)) {
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
  return parseGroupByAnd(newQuery);
}

export function skipGroupByAnd(query: AzureQuery) {
  let result = true;

  if (query && query.group_by) {
    for (const key of Object.keys(query.group_by)) {
      const groupBy = query.group_by[key];
      if (groupBy instanceof Array && groupBy.length > 1) {
        result = false;
        break;
      }
    }
  }
  return result;
}
