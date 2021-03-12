import { parse, stringify } from 'qs';

export const logicalOrPrefix = 'or:'; // logical OR prefix for group_by
export const logicalAndPrefix = 'and:'; // logical AND prefix for group_by
export const tagPrefix = 'tag:'; // Tag prefix for group_by

export const breakdownDescKey = 'breakdown_desc'; // Used to display a description in the breakdown header
export const breakdownGroupByKey = 'breakdown_group_by'; // Used to display a breadcrumb in the breakdown header
export const breakdownTitleKey = 'breakdown_title'; // Used to display a title in the breakdown header
export const orgUnitIdKey = 'org_unit_id'; // Org unit ID for group_by
export const orgUnitNameKey = 'org_unit_name'; // Org unit name for group_by
export const tagKey = 'tag'; // Tag key prefix for group_by

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
  filter_by?: any;
  group_by?: any;
  key_only?: boolean;
  order_by?: any;
  perspective?: any;
  start_date?: any;
}

// Adds group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function addFilterByPrifix(query: Query, prefix: string = logicalOrPrefix) {
  if (!(query && query.filter_by)) {
    return query;
  }
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    filter_by: {},
  };
  for (const key of Object.keys(query.filter_by)) {
    // Prefix may be set externally
    const newKey = key.indexOf(logicalOrPrefix) === 0 || key.indexOf(logicalAndPrefix) === 0 ? key : `${prefix}${key}`;
    newQuery.filter_by[newKey] = query.filter_by[key];
  }
  return newQuery;
}

// Adds group_by prefix -- https://github.com/project-koku/koku-ui/issues/704
export function addGroupByPrifix(query: Query, prefix: string = logicalOrPrefix) {
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

// Filters are returned with logical AND
export function getLogicalAndQuery(query: Query) {
  return getQuery(query, logicalAndPrefix);
}

// Filters are returned with logical OR
export function getLogicalOrQuery(query: Query) {
  return getQuery(query, logicalOrPrefix);
}

// Returns true if given query contains multiple group_by or filter_by props
function hasMultipleBys(query: Query, propName: string) {
  // Workaround for https://github.com/project-koku/koku/issues/1596
  if (query && query[propName]) {
    const keys = Object.keys(query[propName]);
    if (keys && keys.length > 1) {
      return true;
    } else {
      // Find a tag (#1596) or group_by with multiple keys
      for (const key of keys) {
        if ((Array.isArray(query[propName][key]) && query[propName][key].length > 1) || key.indexOf(tagPrefix) !== -1) {
          return true;
        }
      }
    }
  }
}

// Filters are returned with logical OR by default
export function getQuery(query: Query, prefix: string = logicalOrPrefix) {
  // Skip adding logical OR/AND prefix for a single group_by / filter_by params
  const addGroupByPrefix = hasMultipleBys(query, 'group_by');
  const addFilterByPrefix = hasMultipleBys(query, 'filter_by');

  const _newQuery = addFilterByPrefix ? addFilterByPrifix(query, prefix) : query;
  const newQuery = addGroupByPrefix ? addGroupByPrifix(_newQuery, prefix) : _newQuery;

  return stringify(convertFilterBy(newQuery), { encode: false, indices: false });
}

// Returns query without group_by prefix
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
