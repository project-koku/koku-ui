import type { Location } from '@remix-run/router';
import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';

export const getRouteForQuery = (query: Query, location: Location, reset: boolean = false) => {
  // Reset pagination
  if (reset) {
    if (query.filter && query.filter.offset !== undefined) {
      query.filter = {
        ...query.filter,
        offset: 0,
      };
    }
    if (query.offset !== undefined) {
      query.offset = 0;
    }
  }
  return `${location.pathname}?${getQueryRoute(query)}`;
};
