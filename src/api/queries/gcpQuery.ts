import * as utils from './query';

export interface GcpFilters extends utils.Filters {
  account?: string | number;
}

type GcpGroupByValue = string | string[];

interface GcpGroupBys {
  service?: GcpGroupByValue;
  account?: GcpGroupByValue;
  instance_type?: GcpGroupByValue;
  project?: GcpGroupByValue;
  region?: GcpGroupByValue;
}

interface GcpOrderBys {
  account?: string;
  cost?: string;
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

// Filters are returned with logical AND
export function getLogicalAndQuery(query: GcpQuery) {
  return utils.getLogicalAndQuery(query);
}

// Filters are returned with logical OR
export function getLogicalOrQuery(query: GcpQuery) {
  return utils.getLogicalOrQuery(query);
}

export function getQueryRoute(query: GcpQuery) {
  return utils.getQueryRoute(query);
}

// Filters are returned without logical OR/AND
export function getQuery(query: GcpQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
