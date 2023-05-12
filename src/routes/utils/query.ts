import type { Location } from '@remix-run/router';
import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';

import type { Filter } from './filter';
import { addFilterToQuery, removeFilterFromQuery } from './filter';

export const initQuery = (query: Query, reset: boolean = false, props = {}) => {
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    ...props,
  };

  // Reset pagination
  if (reset) {
    if (newQuery.filter && newQuery.filter.offset !== undefined) {
      newQuery.filter = {
        ...query.filter,
        offset: 0,
      };
    }
    if (newQuery.offset !== undefined) {
      newQuery.offset = 0;
    }
  }
  return newQuery;
};

export const getRouteForQuery = (query: Query, location: Location, reset: boolean = false) => {
  const newQuery = initQuery(query, reset);
  return `${location.pathname}?${getQueryRoute(newQuery)}`;
};

export const handleOnCurrencySelected = (query: Query) => {
  return initQuery(query);
};

export const handleOnCostTypeSelected = (query: Query) => {
  return initQuery(query);
};

export const handleOnCostDistributionSelected = (query: Query) => {
  return initQuery(query, false, {
    order_by: undefined, // Clear sort
  });
};

export const handleOnFilterAdded = (query: Query, filter: Filter) => {
  const newQuery = initQuery(query, true);
  return addFilterToQuery(newQuery, filter);
};

export const handleOnFilterRemoved = (query: Query, filter: Filter) => {
  const newQuery = initQuery(query, true);
  return removeFilterFromQuery(newQuery, filter);
};

export const handleOnPerPageSelect = (query: Query, perPage: number) => {
  return initQuery(query, false, {
    filter: {
      ...query.filter,
      limit: perPage,
    },
  });
};

export const handleOnSetPage = (query: Query, report, pageNumber) => {
  const limit = report && report.meta && report.meta.filter && report.meta.filter.limit ? report.meta.filter.limit : 10;
  const offset = pageNumber * limit - limit;

  return initQuery(query, false, {
    filter: {
      ...query.filter,
      offset,
    },
  });
};

export const handleOnSort = (query: Query, sortType: string, isSortAscending: boolean, date: string = undefined) => {
  return initQuery(query, false, {
    order_by: {
      [sortType]: isSortAscending ? 'asc' : 'desc',
      ...(date && {
        date,
      }),
    },
  });
};
