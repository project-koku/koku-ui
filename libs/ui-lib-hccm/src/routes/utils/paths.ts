import { getQueryRoute } from '@koku-ui/api/queries/query';

import { breadcrumbLabelKey, breakdownDescKey, breakdownTitleKey, orgUnitIdKey } from '../../utils/props';

export const getBreakdownPath = ({
  basePath,
  description,
  groupBy,
  id,
  isPlatformCosts,
  isOptimizationsPath,
  isOptimizationsTab,
  title,
}: {
  basePath: string;
  description?: string; // Used to display a description in the breakdown header
  groupBy: string | number;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isPlatformCosts?: boolean;
  isOptimizationsPath?: boolean;
  isOptimizationsTab?: boolean;
  title: string | number; // Used to display a title in the breakdown header
}) => {
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
  };
  return `${basePath}?${getQueryRoute(newQuery)}`;
};

export const getOptimizationsBreakdownPath = ({
  basePath,
  breadcrumbLabel,
  id,
  title,
}: {
  basePath?: string;
  breadcrumbLabel?: string; // Used to display a breadcrumb in the breakdown header
  id: string | number; // group_by[account]=<id> param in the breakdown page
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const newQuery: any = {
    id,
    ...(title && { [breakdownTitleKey]: title }),
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
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
