import * as utils from './query';

export interface IbmFilters extends utils.Filters {
  account?: string | number;
}

type IbmGroupByValue = string | string[];

interface IbmGroupBys {
  service?: IbmGroupByValue;
  account?: IbmGroupByValue;
  instance_type?: IbmGroupByValue;
  project?: IbmGroupByValue;
  region?: IbmGroupByValue;
}

interface IbmOrderBys {
  account?: string;
  cost?: string;
  project?: string;
  region?: string;
  service?: string;
  usage?: string;
}

export interface IbmQuery extends utils.Query {
  delta?: string;
  filter?: IbmFilters;
  group_by?: IbmGroupBys;
  order_by?: IbmOrderBys;
}

// Filters are returned with logical AND
export function getLogicalAndQuery(query: IbmQuery) {
  return utils.getLogicalAndQuery(query);
}

// Filters are returned with logical OR
export function getLogicalOrQuery(query: IbmQuery) {
  return utils.getLogicalOrQuery(query);
}

export function getQueryRoute(query: IbmQuery) {
  return utils.getQueryRoute(query);
}

// Filters are returned without logical OR/AND
export function getQuery(query: IbmQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
