import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import { breakdownDescKey, breakdownTitleKey, orgUnitIdKey } from 'utils/props';
import type { RouteComponentProps } from 'utils/router';

export const getBreakdownPath = ({
  basePath,
  description,
  groupBy,
  id,
  isPlatformCosts,
  isOptimizationsPath,
  isOptimizationsTab,
  router,
  title,
}: {
  basePath: string;
  description?: string; // Used to display a description in the breakdown header
  groupBy: string | number;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isPlatformCosts?: boolean;
  isOptimizationsPath?: boolean;
  isOptimizationsTab?: boolean;
  router: RouteComponentProps;
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const queryFromRoute = router ? parseQuery<Query>(router.location.search) : undefined;
  const state = queryFromRoute ? JSON.stringify(queryFromRoute) : undefined; // Ignores query prefix
  const newQuery: any = {
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(title && { [breakdownTitleKey]: title }),
    optimizationsPath: isOptimizationsPath ? true : undefined,
    optimizationsTab: isOptimizationsTab ? true : undefined, // Clear query params
    ...(groupBy && {
      group_by: {
        [groupBy]: isPlatformCosts ? '*' : id, // Use ID here -- see https://github.com/project-koku/koku-ui/pull/2821
      },
    }),
    id,
    isPlatformCosts: isPlatformCosts ? true : undefined,
    ...(state && { state: window.btoa(state) }),
  };
  return `${basePath}?${getQueryRoute(newQuery)}`;
};

export const getOptimizationsBreakdownPath = ({
  basePath,
  id,
  query,
  title,
}: {
  basePath: string;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  query?: Query;
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const state = query ? JSON.stringify(query) : undefined; // Ignores query prefix

  const newQuery: any = {
    id,
    ...(state && { state: window.btoa(state) }),
    ...(title && { [breakdownTitleKey]: title }),
  };
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
  const state = JSON.stringify(queryFromRoute); // Ignores query prefix
  const newQuery: any = {
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(title && { [breakdownTitleKey]: title }),
    ...(groupByOrg && { [orgUnitIdKey]: groupByOrg }), // Used to set group by for return link
    filter: {
      ...(type === 'account' && { account: id }),
    },
    group_by: {
      [groupBy]: id, // Group by may be overridden below
    },
    state: window.btoa(state),
  };
  if (type === 'account') {
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
