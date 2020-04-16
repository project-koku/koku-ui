import * as utils from './query';

export interface OcpCloudFilters extends utils.Filters {
  project?: string | number;
}

type OcpCloudGroupByValue = string | string[];

interface OcpCloudGroupBys {
  account?: OcpCloudGroupByValue;
  cluster?: OcpCloudGroupByValue;
  node?: OcpCloudGroupByValue;
  project?: OcpCloudGroupByValue;
  region?: OcpCloudGroupByValue;
  service?: OcpCloudGroupByValue;
}

interface OcpCloudOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpCloudQuery extends utils.Query {
  delta?: string;
  filter?: OcpCloudFilters;
  group_by?: OcpCloudGroupBys;
  order_by?: OcpCloudOrderBys;
}

export function getQueryRoute(query: OcpCloudQuery) {
  return utils.getQueryRoute(query);
}

export function getQuery(query: OcpCloudQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
