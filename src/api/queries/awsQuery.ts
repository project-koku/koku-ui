import * as utils from './query';

export interface AwsFilters extends utils.Filters {
  account?: string | number;
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
  cost?: string;
  usage?: string;
}

export interface AwsQuery extends utils.Query {
  delta?: string;
  filter?: AwsFilters;
  group_by?: AwsGroupBys;
  order_by?: AwsOrderBys;
}

export function getQueryRoute(query: AwsQuery) {
  return utils.getQueryRoute(query);
}

export function getQuery(query: AwsQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
