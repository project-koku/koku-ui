import { parse, stringify } from 'qs';

export interface OcpFilters {
  time_scope_value?: number;
  time_scope_units?: 'month' | 'day';
  resolution?: 'daily' | 'monthly';
  limit?: number;
}

type OcpGroupByValue = string | string[];

interface OcpGroupBys {
  cluster?: OcpGroupByValue;
  node?: OcpGroupByValue;
  project?: OcpGroupByValue;
}

interface OcpOrderBys {
  charge?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpQuery {
  delta?: string;
  filter?: OcpFilters;
  group_by?: OcpGroupBys;
  order_by?: OcpOrderBys;
}

export function getQuery(query: OcpQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
