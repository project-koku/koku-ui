import { parse, stringify } from 'qs';

export interface OcpOnAwsFilters {
  limit?: number;
  product_family?: string;
  project?: string | number;
  resolution?: 'daily' | 'monthly';
  time_scope_value?: number;
  time_scope_units?: 'month' | 'day';
}

type OcpOnAwsGroupByValue = string | string[];

interface OcpOnAwsGroupBys {
  cluster?: OcpOnAwsGroupByValue;
  node?: OcpOnAwsGroupByValue;
  project?: OcpOnAwsGroupByValue;
}

interface OcpOnAwsOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpOnAwsQuery {
  delta?: string;
  filter?: OcpOnAwsFilters;
  group_by?: OcpOnAwsGroupBys;
  order_by?: OcpOnAwsOrderBys;
  key_only?: boolean;
}

export function getQuery(query: OcpOnAwsQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
