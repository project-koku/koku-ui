import type { Query } from 'api/queries/query';
import type { RouteComponentProps } from 'utils/router';

import type { Filter } from './filter';
import * as handles from './handles';
import { getRouteForQuery } from './query';

export const handleOnCurrencySelected = (query: Query, router: RouteComponentProps) => {
  const newQuery = handles.handleOnCurrencySelected(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true }); // Don't reset pagination
};

export const handleOnCostTypeSelected = (query: Query, router: RouteComponentProps) => {
  const newQuery = handles.handleOnCostTypeSelected(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true }); // Don't reset pagination
};

export const handleOnCostDistributionSelected = (query: Query, router: RouteComponentProps) => {
  const newQuery = handles.handleOnCostDistributionSelected(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true }); // Don't reset pagination
};

export const handleOnFilterAdded = (query: Query, router: RouteComponentProps, filter: Filter) => {
  const newQuery = handles.handleOnFilterAdded(query, filter);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnFilterRemoved = (query: Query, router: RouteComponentProps, filter: Filter) => {
  const newQuery = handles.handleOnFilterRemoved(query, filter);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnPerPageSelect = (query: Query, router: RouteComponentProps, perPage: number) => {
  const newQuery = handles.handleOnPerPageSelect(query, perPage);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnSetPage = (query: Query, router: RouteComponentProps, report, pageNumber) => {
  const newQuery = handles.handleOnSetPage(query, report, pageNumber);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};

export const handleOnSort = (
  query: Query,
  router: RouteComponentProps,
  sortType: string,
  isSortAscending: boolean,
  date: string = undefined
) => {
  const newQuery = handles.handleOnSort(query, sortType, isSortAscending, date);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
};
