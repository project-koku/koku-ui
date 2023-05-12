import type { Query } from 'api/queries/query';
import type { Filter } from 'routes/utils/filter';
import * as queryUtils from 'routes/utils/query';
import type { RouteComponentProps } from 'utils/router';

import { getRouteForQuery } from './query';

export const handleOnCurrencySelected = (query: Query, router: RouteComponentProps) => {
  const newQuery = queryUtils.handleOnCurrencySelected(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true }); // Don't reset pagination
};

export const handleOnCostTypeSelected = (query: Query, router: RouteComponentProps) => {
  const newQuery = queryUtils.handleOnCostTypeSelected(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true }); // Don't reset pagination
};

export const handleOnCostDistributionSelected = (query: Query, router: RouteComponentProps) => {
  const newQuery = queryUtils.handleOnCostDistributionSelected(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true }); // Don't reset pagination
};

export const handleOnFilterAdded = (query: Query, router: RouteComponentProps, filter: Filter) => {
  const newQuery = queryUtils.handleOnFilterAdded(query, filter);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnFilterRemoved = (query: Query, router: RouteComponentProps, filter: Filter) => {
  const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnPerPageSelect = (query: Query, router: RouteComponentProps, perPage: number) => {
  const newQuery = queryUtils.handleOnPerPageSelect(query, perPage);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnSetPage = (query: Query, router: RouteComponentProps, report, pageNumber) => {
  const newQuery = queryUtils.handleOnSetPage(query, report, pageNumber);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnSort = (
  query: Query,
  router: RouteComponentProps,
  sortType: string,
  isSortAscending: boolean,
  date: string = undefined
) => {
  const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending, date);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};
