import { parse, stringify } from 'qs';

export const groupByPrefix = 'or:'; // logical OR ('or:') or AND ('and:') prefix for group_by
export const orgUnitIdPrefix = 'org_unit_id'; // Org unit ID for group_by
export const orgUnitNamePrefix = 'org_unit_name'; // Org unit name for group_by
export const tagKeyPrefix = 'tag:'; // Tag key prefix for group_by

type FilterByValue = string | string[];

interface FilterBys {
  tag?: FilterByValue;
}

export interface Filters {
  limit?: number;
  offset?: number;
  resolution?: 'daily' | 'monthly';
  service?: string;
  service_name?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

export interface Query {
  filter?: any;
  filter_by?: FilterBys;
  group_by?: any;
  key_only?: boolean;
}

// Adds group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function addGroupByPrifix(query: Query) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    newQuery.group_by[`${groupByPrefix}${key}`] = query.group_by[key];
  }
  return newQuery;
}

// Converts filter_by props to group_by
export function convertFilterByToGroupBy(query: Query) {
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

// Returns query without group_by prefix
export function getQueryRoute(query: Query) {
  return stringify(query, { encode: false, indices: false });
}

// Returns query and adds group_by prefix
export function getQuery(query: Query) {
  const newQuery = convertFilterByToGroupBy(query);
  let addGroupByPrefix = false;

  // Workaround for https://github.com/project-koku/koku/issues/1596
  if (newQuery && newQuery.group_by) {
    const keys = Object.keys(newQuery.group_by);
    if (keys && keys.length > 1) {
      addGroupByPrefix = true;
    } else {
      // Find a tag (#1596) or group_by with multiple keys
      for (const key of keys) {
        if (
          (Array.isArray(newQuery.group_by[key]) &&
            newQuery.group_by[key].length > 1) ||
          key.indexOf(tagKeyPrefix) !== -1
        ) {
          addGroupByPrefix = true;
        }
      }
    }
  }

  // Skip adding group_by prefix for a single group_by
  const q = addGroupByPrefix ? addGroupByPrifix(newQuery) : newQuery;
  return stringify(q, { encode: false, indices: false });
}

// Returns query without filter_by prefix
export function parseFilterByPrefix(query: Query) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    const index = key.indexOf(groupByPrefix);
    const filterByKey =
      index !== -1 ? key.substring(index + groupByPrefix.length) : key;
    newQuery.filter_by[filterByKey] = query.filter_by[key];
  }
  return newQuery;
}

// Returns query without group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByPrefix(query: Query) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    const index = key.indexOf(groupByPrefix);
    const groupByKey =
      index !== -1 ? key.substring(index + groupByPrefix.length) : key;
    newQuery.group_by[groupByKey] = query.group_by[key];
  }
  return newQuery;
}

export function parseQuery<T = any>(query: string): T {
  const newQuery = parse(query, { ignoreQueryPrefix: true });
  return parseFilterByPrefix(parseGroupByPrefix(newQuery));
}
