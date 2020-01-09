import { parse, stringify } from 'qs';

export interface OcpCloudFilters {
  limit?: number;
  offset?: number;
  project?: string | number;
  resolution?: 'daily' | 'monthly';
  service?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type OcpCloudGroupByValue = string | string[];

interface OcpCloudGroupBys {
  account?: OcpCloudGroupByValue;
  cluster?: OcpCloudGroupByValue;
  node?: OcpCloudGroupByValue;
  project?: OcpCloudGroupByValue;
  region?: OcpCloudGroupByValue;
  service?: OcpCloudGroupByValue;
}

interface OcpCloudOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpCloudQuery {
  delta?: string;
  filter?: OcpCloudFilters;
  filter_by?: OcpCloudGroupBys;
  group_by?: OcpCloudGroupBys;
  order_by?: OcpCloudOrderBys;
  key_only?: boolean;
}

const groupByAnd = 'and:';

// Adds logical AND to filter_by and converts to group_by
export function getFilterByAnd(query: OcpCloudQuery) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    if (query.group_by[key] === '*') {
      newQuery.group_by[`${key}`] = undefined;
    }
    newQuery.group_by[`${groupByAnd}${key}`] = query.filter_by[key];
  }
  return newQuery;
}

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getGroupByAnd(query: OcpCloudQuery) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    if (query.group_by[key] === '*') {
      newQuery.group_by[`${key}`] = undefined;
    }
    newQuery.group_by[`${groupByAnd}${key}`] = query.group_by[key];
  }
  return newQuery;
}

// Skip adding logical AND to group_by
export function getQueryRoute(query: OcpCloudQuery) {
  return stringify(query, { encode: false, indices: false });
}

// Adds logical AND to group_by
export function getQuery(query: OcpCloudQuery, filterBy: boolean = false) {
  const newQuery = getFilterByAnd(getGroupByAnd(query));
  return stringify(newQuery, { encode: false, indices: false });
}

// Removes logical AND from filter_by
export function parseFilterByAnd(query: OcpCloudQuery) {
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
export function parseGroupByAnd(query: OcpCloudQuery) {
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
