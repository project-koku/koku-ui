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
  gpu_count?: string;
  node?: string;
  project?: string;
  persistentvolumeclaim?: string;
  request?: string;
  usage?: string;
}

export interface OcpQuery extends utils.Query {
  category?: string;
  delta?: string;
  filter?: OcpFilters;
  group_by?: OcpGroupBys;
  order_by?: OcpOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: OcpQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: OcpQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
