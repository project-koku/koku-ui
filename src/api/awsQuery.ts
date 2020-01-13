import { parse, stringify } from 'qs';

export interface AwsFilters {
  account?: string | number;
  limit?: number;
  offset?: number;
  resolution?: 'daily' | 'monthly';
  service?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type AwsGroupByValue = string | string[];

interface AwsGroupBys {
  service?: AwsGroupByValue;
  account?: AwsGroupByValue;
  instance_type?: AwsGroupByValue;
  region?: AwsGroupByValue;
  tags?: AwsGroupByValue;
}

interface AwsOrderBys {
  account?: string;
  region?: string;
  service?: string;
  cost?: string;
  usage?: string;
}

export interface AwsQuery {
  delta?: string;
  filter?: AwsFilters;
  filter_by?: AwsGroupBys;
  group_by?: AwsGroupBys;
  order_by?: AwsOrderBys;
  key_only?: boolean;
}

const groupByAnd = 'and:';
const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getLogicalAnd(query: AwsQuery) {
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
export function getGroupBy(query: AwsQuery) {
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
export function getQueryRoute(query: AwsQuery) {
  return stringify(query, { encode: false, indices: false });
}

// Adds logical AND
export function getQuery(query: AwsQuery) {
  const newQuery = getGroupBy(query);
  const groupByKeys = newQuery.group_by ? Object.keys(newQuery.group_by) : [];

  // Workaround for https://github.com/project-koku/koku/issues/1596
  let isGroupByAnd = false;
  if (groupByKeys.length === 1) {
    for (const key of groupByKeys) {
      isGroupByAnd = key.indexOf(tagKey) !== -1;
    }
  }

  // Skip logical AND for single group_by
  const q =
    groupByKeys.length > 1 || isGroupByAnd ? getLogicalAnd(newQuery) : newQuery;
  return stringify(q, { encode: false, indices: false });
}

// Removes logical AND from filter_by
export function parseFilterByAnd(query: AwsQuery) {
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
export function parseGroupByAnd(query: AwsQuery) {
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
