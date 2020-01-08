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
export function getFilterByAnd(
  query: OcpCloudQuery,
  filterBy: boolean = false
) {
  if (
    !(query && query.filter_by) ||
    Object.keys(query.filter_by).length === 0
  ) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  if (!skipFilterByAnd(query)) {
    for (const key of Object.keys(query.filter_by)) {
      if (query.group_by[key] === '*') {
        newQuery.group_by[key] = query.filter_by[key];
      } else {
        if (filterBy) {
          newQuery.filter_by[`${groupByAnd}${key}`] = query.filter_by[key];
        } else {
          newQuery.group_by[`${groupByAnd}${key}`] = query.filter_by[key];
        }
      }
    }
  } else {
    if (newQuery.group_by) {
      newQuery.group_by = [query.group_by, query.filter_by];
    } else {
      newQuery.group_by = query.filter_by;
    }
  }
  return newQuery;
}

// Adds logical AND to group_by -- https://github.com/project-koku/koku-ui/issues/704
export function getGroupByAnd(query: OcpCloudQuery) {
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

export function getQuery(query: OcpCloudQuery, filterBy: boolean = false) {
  const newQuery = getFilterByAnd(getGroupByAnd(query), filterBy);
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

export function skipFilterByAnd(query: OcpCloudQuery) {
  let result = true;

  if (query && query.filter_by) {
    for (const key of Object.keys(query.filter_by)) {
      const filterBy = query.filter_by[key];
      if (filterBy instanceof Array && filterBy.length > 0) {
        result = false;
        break;
      }
    }
  }
  return result;
}

export function skipGroupByAnd(query: OcpCloudQuery) {
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
