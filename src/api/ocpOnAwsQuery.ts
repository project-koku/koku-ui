import { parse, stringify } from 'qs';

export interface OcpOnAwsFilters {
  limit?: number;
  offset?: number;
  product_family?: string;
  project?: string | number;
  resolution?: 'daily' | 'monthly';
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type OcpOnAwsGroupByValue = string | string[];

interface OcpOnAwsGroupBys {
  account?: OcpOnAwsGroupByValue;
  cluster?: OcpOnAwsGroupByValue;
  node?: OcpOnAwsGroupByValue;
  project?: OcpOnAwsGroupByValue;
  region?: OcpOnAwsGroupByValue;
  service?: OcpOnAwsGroupByValue;
}

interface OcpOnAwsOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpOnAwsQuery {
  delta?: string;
  filter?: OcpOnAwsFilters;
  group_by?: OcpOnAwsGroupBys;
  order_by?: OcpOnAwsOrderBys;
  key_only?: boolean;
}

const groupByAnd = 'and:';

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getGroupByAnd(query: OcpOnAwsQuery) {
  if (!(query && query.group_by)) {
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

export function getQuery(query: OcpOnAwsQuery) {
  const newQuery = getGroupByAnd(query);
  return stringify(newQuery, { encode: false, indices: false });
}

// Removes logical AND from group_by -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByAnd(query: OcpOnAwsQuery) {
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
  return parseGroupByAnd(newQuery);
}
