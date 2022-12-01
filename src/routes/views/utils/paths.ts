import type { Query } from 'api/queries/query';
import { getQueryRoute, platformCategory } from 'api/queries/query';
import { breakdownDescKey, breakdownTitleKey, orgUnitIdKey } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';

export const getBreakdownPath = ({
  basePath,
  description,
  groupBy,
  isPlatformCosts,
  label,
}: {
  basePath: string;
  description: string;
  groupBy: string | number;
  isPlatformCosts?: boolean;
  label: string;
}) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const newQuery = {
    ...queryFromRoute,
    ...(description && description !== label && { [breakdownDescKey]: description }),
    ...(isPlatformCosts && { [breakdownTitleKey]: label }),
    group_by: {
      [groupBy]: label,
    },
    ...(isPlatformCosts && {
      group_by: {
        [groupBy]: ['kube-', 'openshift-'],
      },
    }),
  };
  return `${basePath}?${getQueryRoute(newQuery)}`;
};

export const getOrgBreakdownPath = ({
  basePath,
  description,
  groupBy,
  groupByOrg,
  id,
  title,
  type,
}: {
  basePath: string;
  description: string | number; // Used to display a description in the breakdown header
  groupBy: string | number;
  groupByOrg: string | number; // Used for group_by[org_unit_id]=<groupByOrg> param in the breakdown page
  id: string | number; // group_by[account]=<id> param in the breakdown page
  title: string | number; // Used to display a title in the breakdown header
  type: string; // account or organizational_unit
}) => {
  const queryFromRoute = parseQuery<Query>(location.search);
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
  let result = false;

  // Note that "kube-" and "openshift-" are provided only when users select the 'platform' project.
  // The category below is mainly used to restore state for the previous page
  if (Array.isArray(queryFromRoute.group_by.project)) {
    result =
      queryFromRoute.group_by.project.includes('kube-') && queryFromRoute.group_by.project.includes('openshift-');
  }
  return result && queryFromRoute.category === platformCategory;
};
