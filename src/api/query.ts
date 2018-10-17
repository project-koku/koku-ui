import { parse, stringify } from 'qs';

export interface Filters {
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

interface OrderBys {
  account?: string;
  region?: string;
  service?: string;
  total?: string;
}

export interface Query {
  delta?: boolean;
  filter?: Filters;
  group_by?: GroupBys;
  order_by?: OrderBys;
}

export function getQuery(query: Query) {
  return stringify(query, { encode: false, indices: false });
}

export function parseQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
