import * as utils from './query';

export interface AwsFilters extends utils.Filters {
  account?: string | number;
}

type AwsGroupByValue = string | string[];

interface AwsGroupBys {
  service?: AwsGroupByValue;
  account?: AwsGroupByValue;
  instance_type?: AwsGroupByValue;
  org_unit_id?: AwsGroupByValue;
  region?: AwsGroupByValue;
}

interface AwsOrderBys {
  account?: string;
  region?: string;
  service?: string;
  cost?: string;
  usage?: string;
}

export interface AwsQuery extends utils.Query {
  delta?: string;
  filter?: AwsFilters;
  group_by?: AwsGroupBys;
  order_by?: AwsOrderBys;
}

// Filters are returned with logical AND
export function getLogicalAndQuery(query: AwsQuery) {
  return utils.getLogicalAndQuery(query);
}

// Filters are returned with logical OR
export function getLogicalOrQuery(query: AwsQuery) {
  return utils.getLogicalOrQuery(query);
}

export function getQueryRoute(query: AwsQuery) {
  return utils.getQueryRoute(query);
}

// Filters are returned without logical OR/AND
export function getQuery(query: AwsQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
