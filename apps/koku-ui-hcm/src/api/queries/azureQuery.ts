import * as utils from './query';

export interface AzureFilters extends utils.Filters {
  subscription_guid?: string | number;
}

type AzureGroupByValue = string | string[];

interface AzureGroupBys {
  service_name?: AzureGroupByValue;
  subscription_guid?: AzureGroupByValue;
  resource_location?: AzureGroupByValue;
}

interface AzureOrderBys {
  subscription_guid?: string;
  subscription_name?: string;
  resource_location?: string;
  service_name?: string;
  cost?: string;
  usage?: string;
}

export interface AzureQuery extends utils.Query {
  delta?: string;
  filter?: AzureFilters;
  group_by?: AzureGroupBys;
  order_by?: AzureOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: AzureQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: AzureQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
