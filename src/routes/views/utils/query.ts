import type { Location } from '@remix-run/router';
import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';
import { initQuery } from 'routes/utils/handles';

export const getRouteForQuery = (query: Query, location: Location, reset: boolean = false) => {
  const newQuery = initQuery(query, reset);
  return `${location.pathname}?${getQueryRoute(newQuery)}`;
};
