import { parse, stringify } from 'qs';

interface Filters {
  time_scope_value?: number;
  time_scope_units?: 'month' | 'day';
  resolution?: 'daily' | 'monthly';
  limit?: number;
}

type GroupByValue = string | string[];

interface GroupBys {
  service?: GroupByValue;
  account?: GroupByValue;
  instance_type?: GroupByValue;
  region?: GroupByValue;
}

export interface Query {
  filter?: Filters;
  group_by?: GroupBys;
}

export function getQuery(query: Query) {
  return stringify(query, { encode: false });
}

export function parseQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
