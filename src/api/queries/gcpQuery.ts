import * as utils from './query';

export interface GcpFilters extends utils.Filters {
  account?: string | number;
}

type GcpGroupByValue = string | string[];

interface GcpGroupBys {
  service?: GcpGroupByValue;
  account?: GcpGroupByValue;
  instance_type?: GcpGroupByValue;
  region?: GcpGroupByValue;
  project?: GcpGroupByValue;
}

interface GcpOrderBys {
  account?: string;
  region?: string;
  service?: string;
  cost?: string;
  usage?: string;
  project?: string;
}

export interface GcpQuery extends utils.Query {
  delta?: string;
  filter?: GcpFilters;
  group_by?: GcpGroupBys;
  order_by?: GcpOrderBys;
}

export function getQueryRoute(query: GcpQuery) {
  return utils.getQueryRoute(query);
}

export function getQuery(query: GcpQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
