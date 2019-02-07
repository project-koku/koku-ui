import { parse, stringify } from 'qs';

export interface AwsFilters {
  time_scope_value?: number;
  time_scope_units?: 'month' | 'day';
  resolution?: 'daily' | 'monthly';
  limit?: number;
}

type AwsGroupByValue = string | string[];

interface AwsGroupBys {
  service?: AwsGroupByValue;
  account?: AwsGroupByValue;
  instance_type?: AwsGroupByValue;
  region?: AwsGroupByValue;
}

interface AwsOrderBys {
  account?: string;
  region?: string;
  service?: string;
  total?: string;
}

export interface AwsQuery {
  delta?: string;
  filter?: AwsFilters;
  group_by?: AwsGroupBys;
  order_by?: AwsOrderBys;
  key_only?: boolean;
}

export function getQuery(query: AwsQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
