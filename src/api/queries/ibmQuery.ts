import * as utils from './query';

export interface IbmFilters extends utils.Filters {
  account?: string | number;
}

type IbmGroupByValue = string | string[];

interface IbmGroupBys {
  service?: IbmGroupByValue;
  account?: IbmGroupByValue;
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

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: IbmQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: IbmQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
