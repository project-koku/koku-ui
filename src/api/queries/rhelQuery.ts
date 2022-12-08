import * as utils from './query';

export interface RhelFilters extends utils.Filters {
  project?: string | number;
}

type RhelGroupByValue = string | string[];

interface RhelGroupBys {
  cluster?: RhelGroupByValue;
  node?: RhelGroupByValue;
  project?: RhelGroupByValue;
}

interface RhelOrderBys {
  cost?: string;
  cluster?: string;
  node?: string;
  project?: string;
}

export interface RhelQuery extends utils.Query {
  category?: string;
  delta?: string;
  filter?: RhelFilters;
  group_by?: RhelGroupBys;
  order_by?: RhelOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: RhelQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: RhelQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
