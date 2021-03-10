import { parse, stringify } from 'qs';

export const groupByOrPrefix = 'or:'; // logical OR prefix for group_by
export const groupByAndPrefix = 'and:'; // logical AND prefix for group_by
export const tagPrefix = 'tag:'; // Tag prefix for group_by

export const breakdownDescKey = 'breakdown_desc'; // Used to display a description in the breakdown header
export const breakdownGroupByKey = 'breakdown_group_by'; // Used to display a breadcrumb in the breakdown header
export const breakdownTitleKey = 'breakdown_title'; // Used to display a title in the breakdown header
export const orgUnitIdKey = 'org_unit_id'; // Org unit ID for group_by
export const orgUnitNameKey = 'org_unit_name'; // Org unit name for group_by
export const tagKey = 'tag'; // Tag key prefix for group_by

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
  dateRange?: any;
  end_date?: any;
  filter?: any;
  filter_by?: FilterBys;
  group_by?: any;
  key_only?: boolean;
  order_by?: any;
  perspective?: any;
  start_date?: any;
}

// Adds group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function addFilterByPrifix(query: Query, prefix: string = groupByOrPrefix) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    ...(!(query && query.filter) && { filte: {} }),
  };
  for (const key of Object.keys(query.filter_by)) {
    newQuery.filter_by[key] = undefined;
    newQuery.filter_by[`${prefix}${key}`] = query.filter_by[key];
  }
  return newQuery;
}

// Adds group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function addGroupByPrifix(query: Query, prefix: string = groupByOrPrefix) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    newQuery.group_by[`${prefix}${key}`] = query.group_by[key];
  }
  return newQuery;
}

// Converts filter_by props to filter
export function convertFilterBy(query: Query) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    if (!newQuery.filter) {
      newQuery.filter = {};
    }
    if (newQuery.filter[key]) {
      if (!Array.isArray(newQuery.filter[key])) {
        newQuery.filter[key] = newQuery.filter[key] !== '*' ? [newQuery.filter[key]] : [];
      }
      newQuery.filter[key].push(query.filter_by[key]);
    } else {
      newQuery.filter[key] = query.filter_by[key];
    }
  }
  return newQuery;
}

// Returns query without group_by prefix
export function getQueryRoute(query: Query) {
  return stringify(query, { encode: false, indices: false });
}

// Returns query and adds group_by prefix
export function getQuery(query: Query, prefix: string = groupByOrPrefix) {
  // Workaround for https://github.com/project-koku/koku/issues/1596
  const hasMultipleBys = prop => {
    if (query && query[prop]) {
      const keys = Object.keys(query[prop]);
      if (keys && keys.length > 1) {
        return true;
      } else {
        // Find a tag (#1596) or group_by with multiple keys
        for (const key of keys) {
          if ((Array.isArray(query[prop][key]) && query[prop][key].length > 1) || key.indexOf(tagPrefix) !== -1) {
            return true;
          }
        }
      }
    }
  };

  // Skip adding logical OR/AND prefix for a single group_by / filter_by
  const addGroupByPrefix = hasMultipleBys('group_by');
  const addFilterByPrefix = hasMultipleBys('filter_by');

  const filterByPrefixQuery = addFilterByPrefix ? addFilterByPrifix(query, prefix) : query;
  const groupByPrefixQuery = addGroupByPrefix ? addGroupByPrifix(filterByPrefixQuery, prefix) : filterByPrefixQuery;
  const newQuery = convertFilterBy(groupByPrefixQuery);

  return stringify(newQuery, { encode: false, indices: false });
}

// Returns query without filter_by prefix
export function parseFilterByPrefix(query: Query, prefix: string = groupByOrPrefix) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    const index = key.indexOf(prefix);
    const filterByKey = index !== -1 ? key.substring(index + prefix.length) : key;
    newQuery.filter_by[filterByKey] = query.filter_by[key];
  }
  return newQuery;
}

// Returns query without group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByPrefix(query: Query, prefix: string = groupByOrPrefix) {
  if (!(query && query.group_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    group_by: {},
  };
  for (const key of Object.keys(query.group_by)) {
    const index = key.indexOf(prefix);
    const groupByKey = index !== -1 ? key.substring(index + prefix.length) : key;
    newQuery.group_by[groupByKey] = query.group_by[key];
  }
  return newQuery;
}

export function parseQuery<T = any>(query: string): T {
  const newQuery = parse(query, { ignoreQueryPrefix: true });
  return parseFilterByPrefix(parseGroupByPrefix(newQuery));
}
