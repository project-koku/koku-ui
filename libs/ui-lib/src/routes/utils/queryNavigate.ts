import type { Query } from '@koku-ui/api/queries/query';

import type { RouteComponentProps } from '../../utils/router';
import type { Filter } from './filter';
import * as queryUtils from './query';
import { getRouteForQuery } from './query';

export const handleOnCurrencySelect = (query: Query, router: RouteComponentProps, state = undefined) => {
  const newQuery = queryUtils.handleOnCurrencySelect(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true, state }); // Don't reset pagination
};

export const handleOnCostTypeSelect = (query: Query, router: RouteComponentProps, state = undefined) => {
  const newQuery = queryUtils.handleOnCostTypeSelect(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true, state }); // Don't reset pagination
};

export const handleOnCostDistributionSelect = (query: Query, router: RouteComponentProps, state = undefined) => {
  const newQuery = queryUtils.handleOnCostDistributionSelect(query);
  router.navigate(getRouteForQuery(newQuery, router.location), { replace: true, state }); // Don't reset pagination
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
