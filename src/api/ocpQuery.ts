import * as utils from './query';

export interface OcpFilters extends utils.Filters {
  project?: string | number;
}

type OcpGroupByValue = string | string[];

interface OcpGroupBys {
  cluster?: OcpGroupByValue;
  node?: OcpGroupByValue;
  project?: OcpGroupByValue;
}

interface OcpOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface OcpQuery extends utils.Query {
  delta?: string;
  filter?: OcpFilters;
  group_by?: OcpGroupBys;
  order_by?: OcpOrderBys;
  key_only?: boolean;
}

export function getQueryRoute(query: OcpQuery) {
  return utils.getQueryRoute(query);
}

export function getQuery(query: OcpQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
