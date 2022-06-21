import * as utils from './query';

export interface OciFilters extends utils.Filters {
  subscription_guid?: string | number;
}

type OciGroupByValue = string | string[];

interface OciGroupBys {
  service_name?: OciGroupByValue;
  subscription_guid?: OciGroupByValue;
  resource_location?: OciGroupByValue;
}

interface OciOrderBys {
  subscription_guid?: string;
  resource_location?: string;
  service_name?: string;
  cost?: string;
  usage?: string;
}

export interface OciQuery extends utils.Query {
  delta?: string;
  filter?: OciFilters;
  group_by?: OciGroupBys;
  order_by?: OciOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: OciQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: OciQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
