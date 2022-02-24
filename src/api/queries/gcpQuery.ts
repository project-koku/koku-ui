import * as utils from './query';

export interface GcpFilters extends utils.Filters {
  account?: string | number;
}

type GcpGroupByValue = string | string[];

interface GcpGroupBys {
  service?: GcpGroupByValue;
  account?: GcpGroupByValue;
  gcp_project?: GcpGroupByValue;
  project?: GcpGroupByValue;
  region?: GcpGroupByValue;
}

interface GcpOrderBys {
  account?: string;
  cost?: string;
  gcp_project?: string;
  project?: string;
  region?: string;
  service?: string;
  usage?: string;
}

export interface GcpQuery extends utils.Query {
  delta?: string;
  filter?: GcpFilters;
  group_by?: GcpGroupBys;
  order_by?: GcpOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: GcpQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: GcpQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
