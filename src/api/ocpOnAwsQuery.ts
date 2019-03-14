import { parse, stringify } from 'qs';

export interface OcpOnAwsFilters {
  limit?: number;
  offset?: number;
  product_family?: string;
  project?: string | number;
  resolution?: 'daily' | 'monthly';
  time_scope_units?: 'month' | 'day';
  time_scope_value?: number;
}

type OcpOnAwsGroupByValue = string | string[];

interface OcpOnAwsGroupBys {
  account?: OcpOnAwsGroupByValue;
  cluster?: OcpOnAwsGroupByValue;
  node?: OcpOnAwsGroupByValue;
  project?: OcpOnAwsGroupByValue;
  region?: OcpOnAwsGroupByValue;
  service?: OcpOnAwsGroupByValue;
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
