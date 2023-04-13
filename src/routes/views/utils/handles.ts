import type { Query } from 'api/queries/query';
import type { RouteComponentProps } from 'utils/router';

import type { Filter } from './filter';
import { addFilterToQuery, removeFilterFromQuery } from './filter';
import { getRouteForQuery } from './query';

export const handleSelected = (query: Query, router: RouteComponentProps, value: string, reset: boolean = false) => {
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
  };
  router.navigate(getRouteForQuery(newQuery, router.location, reset), { replace: true }); // Don't reset pagination
};

export const handleCurrencySelected = (
  query: Query,
  router: RouteComponentProps,
  value: string,
  reset: boolean = false
) => {
  handleSelected(query, router, value, reset);
};

export const handleCostTypeSelected = (
  query: Query,
  router: RouteComponentProps,
  value: string,
  reset: boolean = false
) => {
  handleSelected(query, router, value, reset);
};

export const handleCostDistributionSelected = (
  query: Query,
  router: RouteComponentProps,
  value: string,
  reset: boolean = false
) => {
  handleSelected(query, router, value, reset);
};

export const handleFilterAdded = (query: Query, router: RouteComponentProps, filter: Filter) => {
  const filteredQuery = addFilterToQuery(query, filter);
  router.navigate(getRouteForQuery(filteredQuery, router.location, true), { replace: true });
};

export const handleFilterRemoved = (query: Query, router: RouteComponentProps, filter: Filter) => {
  const filteredQuery = removeFilterFromQuery(query, filter);
  router.navigate(getRouteForQuery(filteredQuery, router.location, true), { replace: true });
};

export const handlePerPageSelect = (query: Query, router: RouteComponentProps, perPage: number) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  newQuery.filter = {
    ...query.filter,
    limit: perPage,
  };
  const filteredQuery = getRouteForQuery(newQuery, router.location, true);
  router.navigate(filteredQuery, { replace: true });
};

export const handleSetPage = (query: Query, router: RouteComponentProps, report, pageNumber) => {
  const limit = report && report.meta && report.meta.filter && report.meta.filter.limit ? report.meta.filter.limit : 10;
  const offset = pageNumber * limit - limit;

  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  newQuery.filter = {
    ...query.filter,
    offset,
  };
  const filteredQuery = getRouteForQuery(newQuery, router.location);
  router.navigate(filteredQuery, { replace: true });
};

export const handleSort = (
  query: Query,
  router: RouteComponentProps,
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
  const filteredQuery = getRouteForQuery(newQuery, router.location);
  router.navigate(filteredQuery, { replace: true });
};
