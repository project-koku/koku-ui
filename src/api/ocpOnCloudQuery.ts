import { parse, stringify } from 'qs';

export interface OcpOnCloudFilters {
  limit?: number;
  offset?: number;
  project?: string | number;
  resolution?: 'daily' | 'monthly';
  service?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type OcpOnCloudGroupByValue = string | string[];

interface OcpOnCloudGroupBys {
  account?: OcpOnCloudGroupByValue;
  cluster?: OcpOnCloudGroupByValue;
  node?: OcpOnCloudGroupByValue;
  project?: OcpOnCloudGroupByValue;
  region?: OcpOnCloudGroupByValue;
  service?: OcpOnCloudGroupByValue;
}

interface OcpOnCloudOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpOnCloudQuery {
  delta?: string;
  filter?: OcpOnCloudFilters;
  group_by?: OcpOnCloudGroupBys;
  order_by?: OcpOnCloudOrderBys;
  key_only?: boolean;
}

const groupByAnd = 'and:';

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getGroupByAnd(query: OcpOnCloudQuery) {
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

export function getQuery(query: OcpOnCloudQuery) {
  const newQuery = getGroupByAnd(query);
  return stringify(newQuery, { encode: false, indices: false });
}

// Removes logical AND from group_by -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByAnd(query: OcpOnCloudQuery) {
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

export function skipGroupByAnd(query: OcpOnCloudQuery) {
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
