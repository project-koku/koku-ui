import * as utils from './query';

export interface AwsFilters extends utils.Filters {
  account?: string | number;
}

type AwsGroupByValue = string | string[];

interface AwsGroupBys {
  service?: AwsGroupByValue;
  account?: AwsGroupByValue;
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

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: AwsQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: AwsQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
