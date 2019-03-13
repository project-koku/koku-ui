import { parse, stringify } from 'qs';

export interface OcpFilters {
  limit?: number;
  offset?: number;
  product_family?: string;
  project?: string | number;
  resolution?: 'daily' | 'monthly';
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type OcpGroupByValue = string | string[];

interface OcpGroupBys {
  cluster?: OcpGroupByValue;
  node?: OcpGroupByValue;
  project?: OcpGroupByValue;
}

interface OcpOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpQuery {
  delta?: string;
  filter?: OcpFilters;
  group_by?: OcpGroupBys;
  order_by?: OcpOrderBys;
  key_only?: boolean;
}

export function getQuery(query: OcpQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
