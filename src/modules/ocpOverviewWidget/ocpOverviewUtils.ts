import { Providers } from 'api/providers';
import { getQueryRoute, Query } from 'api/queries/query';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { FetchStatus } from 'store/common';

export const baseQuery: Query = {
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'daily',
  },
};

export const getRouteForQuery = (history, query: Query, reset: boolean = false) => {
  // Reset pagination
  if (reset) {
    query.filter = {
      ...query.filter,
      offset: baseQuery.filter.offset,
    };
  }
  return `${history.location.pathname}?${getQueryRoute(query)}`;
};

export const isOcpAvailable = (
  ocpProviders: Providers,
  ocpProvidersFetchStatus: FetchStatus,
  userAccess: UserAccess
) => {
  let result = false;
  if (ocpProvidersFetchStatus === FetchStatus.complete) {
    const data = (userAccess.data as any).find(d => d.type === UserAccessType.ocp);
    const isUserAccessAllowed = data && data.access;

    // providers API returns empty data array for no sources
    result =
      isUserAccessAllowed &&
      ocpProviders !== undefined &&
      ocpProviders.meta !== undefined &&
      ocpProviders.meta.count > 0;
  }
  return result;
};
