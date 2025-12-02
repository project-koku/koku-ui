import type { Query } from '@koku-ui/api/queries/query';
import { getQueryRoute } from '@koku-ui/api/queries/query';
import type { Location } from 'react-router-dom';

import type { Filter } from './filter';
import { addFilterToQuery, removeFilterFromQuery } from './filter';

export const initQuery = (query: Query, reset: boolean = false, props = {}) => {
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    ...props,
  };

  // Reset pagination
  if (reset) {
    if (newQuery?.filter?.offset !== undefined) {
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

export const handleOnCurrencySelect = (query: Query) => {
  return initQuery(query);
};

export const handleOnCostTypeSelect = (query: Query) => {
  return initQuery(query);
};

export const handleOnCostDistributionSelect = (query: Query) => {
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

export const handleOnPerPageSelect = (query: Query, perPage: number, isLimit = false) => {
  return initQuery(query, false, {
    ...(isLimit
      ? {
          limit: perPage,
          offset: 0,
        }
      : {
          filter: {
            ...query.filter,
            limit: perPage,
            offset: 0,
          },
        }),
  });
};

export const handleOnSetPage = (query: Query, report, pageNumber, isLimit = false) => {
  let limit = 10;
  if (report?.meta) {
    if (isLimit && report?.meta?.limit !== undefined) {
      limit = report.meta.limit;
    } else if (report?.meta?.filter?.limit !== undefined) {
      limit = report.meta.filter.limit;
    }
  }
  const offset = pageNumber * limit - limit;

  return initQuery(query, false, {
    ...(isLimit
      ? {
          limit,
          offset,
        }
      : {
          filter: {
            ...query.filter,
            limit,
            offset,
          },
        }),
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
