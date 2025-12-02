import { logicalAndPrefix, logicalOrPrefix } from '@koku-ui/utils/props';
import { parse, stringify } from 'qs';

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
  id?: string;
  isPlatformCosts?: boolean;
  key?: string;
  key_only?: boolean;
  limit?: number;
  offset?: number;
  optimizationsPath?: any;
  optimizationsTab?: any;
  order_by?: any;
  order_how?: any;
  perspective?: any;
  project?: any;
  search?: any;
  start_date?: any;
  state?: any;
  tabKey?: number;
}

// Converts filter_by props to filter props
export function convertFilterBy(query: Query) {
  if (!query?.filter_by) {
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

function alphabeticalSort(a, b) {
  return a.localeCompare(b);
}

// filter_by props are converted
export function getQuery(query: Query) {
  return stringify(convertFilterBy(query), { encode: false, indices: false, sort: alphabeticalSort });
}

// filter_by props are not converted
export function getQueryRoute(query: Query) {
  return stringify(query, { encode: false, indices: false, sort: alphabeticalSort });
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

// Returns query without AND/OR prefix for filter_by
export function parseFilterByPrefix(query: Query) {
  if (!query?.filter_by) {
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

// Returns query without AND/OR prefix for group_by -- https://github.com/project-koku/koku-ui/issues/704
export function parseGroupByPrefix(query: Query) {
  if (!query?.group_by) {
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
  const newQuery: any = parse(query, { ignoreQueryPrefix: true });
  return parseFilterByPrefix(parseGroupByPrefix(newQuery));
}
