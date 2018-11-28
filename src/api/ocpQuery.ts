import { parse, stringify } from 'qs';

export interface OcpFilters {
  time_scope_value?: number;
  time_scope_units?: 'month' | 'day';
  resolution?: 'daily' | 'monthly';
  limit?: number;
}

type OcpGroupByValue = string | string[];

interface OcpGroupBys {
  service?: OcpGroupByValue;
  account?: OcpGroupByValue;
  instance_type?: OcpGroupByValue;
  region?: OcpGroupByValue;
}

interface OcpOrderBys {
  account?: string;
  region?: string;
  service?: string;
  total?: string;
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
