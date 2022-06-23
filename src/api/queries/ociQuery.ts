import * as utils from './query';

export interface OciFilters extends utils.Filters {
  payer_tenant_id?: string | number;
}

type OciGroupByValue = string | string[];

interface OciGroupBys {
  product_service?: OciGroupByValue;
  payer_tenant_id?: OciGroupByValue;
  region?: OciGroupByValue;
}

interface OciOrderBys {
  payer_tenant_id?: string;
  region?: string;
  product_service?: string;
  cost?: string;
  usage?: string;
}

export interface OciQuery extends utils.Query {
  delta?: string;
  filter?: OciFilters;
  group_by?: OciGroupBys;
  order_by?: OciOrderBys;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: OciQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: OciQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
