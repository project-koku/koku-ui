import * as utils from './query';

export interface RosFilters extends utils.Filters {
  project?: string | number;
}

type RosGroupByValue = string | string[];

interface RosGroupBys {
  cluster?: RosGroupByValue;
  node?: RosGroupByValue;
  project?: RosGroupByValue;
}

interface RosOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface RosQuery extends utils.Query {
  category?: string;
  delta?: string;
  filter?: RosFilters;
  group_by?: RosGroupBys;
  limit?: number;
  offset?: number;
  order_by?: RosOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: RosQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: RosQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
