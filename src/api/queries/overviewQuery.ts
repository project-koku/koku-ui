import * as utils from './query';

export interface OverviewQuery extends utils.Query {
  infraPerspective?: string;
  ocpPerspective?: string;
  tabKey?: number;
}

// filter_by props are converted and returned with logical OR/AND prefix
export function getQuery(query: OverviewQuery) {
  return utils.getQuery(query);
}

// filter_by props are not converted
export function getQueryRoute(query: OverviewQuery) {
  return utils.getQueryRoute(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
