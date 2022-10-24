import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';

import type { Filter } from './filter';
import { addFilterToQuery, removeFilterFromQuery } from './filter';

export const getRouteForQuery = (history, query: Query, reset: boolean = false) => {
  // Reset pagination
  if (reset) {
    query.filter = {
      ...query.filter,
      offset: 0,
    };
  }
  return `${history.location.pathname}?${getQueryRoute(query)}`;
};

export const handleCurrencySelected = (history, query: Query, value: string, reset: boolean = false) => {
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    currency: value,
  };
  history.replace(getRouteForQuery(history, newQuery, reset));
};

export const handleCostTypeSelected = (history, query: Query, value: string, reset: boolean = false) => {
  // Need param to restore cost type upon page refresh
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    cost_type: value,
  };
  history.replace(getRouteForQuery(history, newQuery, reset)); // Don't reset pagination
};

export const handleFilterAdded = (history, query: Query, filter: Filter) => {
  const filteredQuery = addFilterToQuery(query, filter);
  history.replace(getRouteForQuery(history, filteredQuery, true));
};

export const handleFilterRemoved = (history, query: Query, filter: Filter) => {
  const filteredQuery = removeFilterFromQuery(query, filter);
  history.replace(getRouteForQuery(history, filteredQuery, true));
};

export const handlePerPageSelect = (history, query: Query, perPage: number) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  newQuery.filter = {
    ...query.filter,
    limit: perPage,
  };
  const filteredQuery = getRouteForQuery(history, newQuery, true);
  history.replace(filteredQuery);
};

export const handleSetPage = (history, query: Query, report, pageNumber) => {
  const limit = report && report.meta && report.meta.filter && report.meta.filter.limit ? report.meta.filter.limit : 10;
  const offset = pageNumber * limit - limit;

  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  newQuery.filter = {
    ...query.filter,
    offset,
  };
  const filteredQuery = getRouteForQuery(history, newQuery);
  history.replace(filteredQuery);
};

export const handleSort = (
  history,
  query: Query,
  sortType: string,
  isSortAscending: boolean,
  date: string = undefined
) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  newQuery.order_by = {};
  newQuery.order_by[sortType] = isSortAscending ? 'asc' : 'desc';

  if (date) {
    newQuery.order_by.date = date;
  }
  const filteredQuery = getRouteForQuery(history, newQuery);
  history.replace(filteredQuery);
};
