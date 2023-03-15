import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import { breakdownDescKey, breakdownTitleKey, orgUnitIdKey, platformCategoryKey } from 'utils/props';
import type { RouteComponentProps } from 'utils/router';

export const getBreakdownPath = ({
  basePath,
  description,
  groupBy,
  id,
  isPlatformCosts,
  isRecommendations,
  router,
  title,
}: {
  basePath: string;
  description?: string; // Used to display a description in the breakdown header
  groupBy: string | number;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isPlatformCosts?: boolean;
  isRecommendations?: boolean;
  router: RouteComponentProps;
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const newQuery = {
    ...queryFromRoute,
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(title && { [breakdownTitleKey]: title }),
    ...(isRecommendations && { recommendations: true }),
    group_by: {
      [groupBy]: isPlatformCosts ? '*' : id, // Use ID here -- see https://github.com/project-koku/koku-ui/pull/2821
    },
  };
  if (isPlatformCosts) {
    if (!newQuery.filter) {
      newQuery.filter = {};
    }
    newQuery.filter.category = platformCategoryKey;
  }
  return `${basePath}?${getQueryRoute(newQuery)}`;
};

export const getOrgBreakdownPath = ({
  basePath,
  description,
  groupBy,
  groupByOrg,
  id,
  router,
  title,
  type,
}: {
  basePath: string;
  description: string | number; // Used to display a description in the breakdown header
  groupBy: string | number;
  groupByOrg: string | number; // Used for group_by[org_unit_id]=<groupByOrg> param in the breakdown page
  id: string | number; // group_by[account]=<id> param in the breakdown page
  router: RouteComponentProps;
  title: string | number; // Used to display a title in the breakdown header
  type: string; // account or organizational_unit
}) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const newQuery = {
    ...queryFromRoute,
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(title && { [breakdownTitleKey]: title }),
    ...(groupByOrg && { [orgUnitIdKey]: groupByOrg }),
    group_by: {
      [groupBy]: id, // This may be overridden below
    },
  };
  if (type === 'account') {
    if (!newQuery.filter) {
      newQuery.filter = {};
    }
    newQuery.filter.account = id;
    newQuery.group_by = {
      [orgUnitIdKey]: groupByOrg,
    };
  } else if (type === 'organizational_unit') {
    newQuery.group_by = {
      [orgUnitIdKey]: id,
    };
  }
  return `${basePath}?${getQueryRoute(newQuery)}`;
};

export const isPlatformCosts = (queryFromRoute: Query) => {
  return queryFromRoute && queryFromRoute.filter && queryFromRoute.filter.category === platformCategoryKey;
};
