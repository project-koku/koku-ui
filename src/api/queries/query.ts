import { parse, stringify } from 'qs';

export const logicalOrPrefix = 'or:'; // logical OR prefix for group_by
export const logicalAndPrefix = 'and:'; // logical AND prefix for group_by
export const tagPrefix = 'tag:'; // Tag prefix for group_by

export const breakdownDescKey = 'breakdown_desc'; // Used to display a description in the breakdown header
export const breakdownGroupByKey = 'breakdown_group_by'; // Used to display a breadcrumb in the breakdown header
export const breakdownTitleKey = 'breakdown_title'; // Used to display a title in the breakdown header
export const orgUnitIdKey = 'org_unit_id'; // Org unit ID for group_by
export const orgUnitNameKey = 'org_unit_name'; // Org unit name for group_by
export const platformCategory = 'platform'; // Used to display platform costs
export const tagKey = 'tag'; // Tag key for group_by
export const unallocatedPlatformCapacity = 'Platform Unallocated Capacity'; // Unallocated platform costs
export const unallocatedWorkersCapacity = 'Workers Unallocated Capacity'; // Unallocated workers costs

export interface Filters {
  category?: string;
  limit?: number;
  offset?: number;
  resolution?: 'daily' | 'monthly';
  service?: string;
  service_name?: string;
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

export interface Query {
  breakdown_title?: string | number;
  category?: string;
  cost_type?: any;
  currency?: any;
  dateRangeType?: any;
  end_date?: any;
  exclude?: any;
  filter?: any;
  filter_by?: any;
  group_by?: any;
  key_only?: boolean;
  limit?: number;
  order_by?: any;
  perspective?: any;
  search?: any;
  start_date?: any;
}

// Converts filter_by props to filter props
export function convertFilterBy(query: Query) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: undefined,
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

// filter_by props are converted
export function getQuery(query: Query) {
  return stringify(convertFilterBy(query), { encode: false, indices: false });
}

// filter_by props are not converted
export function getQueryRoute(query: Query) {
  return stringify(query, { encode: false, indices: false });
}

// Returns given key without logical OR/AND prefix
function parseKey(val: string) {
  let key = val;
  let index = val.indexOf(logicalOrPrefix);
  if (index !== -1) {
    key = val.substring(index + logicalOrPrefix.length);
  } else {
    index = val.indexOf(logicalAndPrefix);
    if (index !== -1) {
      key = val.substring(index + logicalAndPrefix.length);
    }
  }
  return key;
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
    const filterByKey = parseKey(key);
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
    const groupByKey = parseKey(key);
    newQuery.group_by[groupByKey] = query.group_by[key];
  }
  return newQuery;
}

export function parseQuery<T = any>(query: string): T {
  const newQuery = parse(query, { ignoreQueryPrefix: true });
  return parseFilterByPrefix(parseGroupByPrefix(newQuery));
}
