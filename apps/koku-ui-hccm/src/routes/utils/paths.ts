import { getQueryRoute } from 'api/queries/query';
import { breadcrumbLabelKey, breadcrumbPathKey, breakdownDescKey, breakdownTitleKey, orgUnitIdKey } from 'utils/props';

export const getBreakdownPath = ({
  basePath,
  breadcrumbLabel,
  breadcrumbPath,
  description,
  groupBy,
  id,
  isPlatformCosts,
  isOptimizationsTab,
  title,
}: {
  basePath: string;
  breadcrumbLabel?: string; // Used to display a breadcrumb in the breakdown header
  breadcrumbPath?: string; // Used for breadcrumb path in the breakdown header
  description?: string; // Used to display a description in the breakdown header
  groupBy: string | number;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isPlatformCosts?: boolean;
  isOptimizationsTab?: boolean;
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const newQuery: any = {
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
    ...(breadcrumbPath && { [breadcrumbPathKey]: breadcrumbPath }),
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(title && { [breakdownTitleKey]: title }),
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

export const getOrgBreakdownPath = ({
  basePath,
  breadcrumbLabel,
  breadcrumbPath,
  description,
  groupBy,
  groupByOrg,
  id,
  title,
  type,
}: {
  basePath: string;
  breadcrumbLabel?: string; // Used to display a breadcrumb in the breakdown header
  breadcrumbPath?: string; // Used for breadcrumb path in the breakdown header
  description: string | number; // Used to display a description in the breakdown header
  groupBy: string | number;
  groupByOrg: string | number; // Used for group_by[org_unit_id]=<groupByOrg> param in the breakdown page
  id: string | number; // group_by[account]=<id> param in the breakdown page
  title: string | number; // Used to display a title in the breakdown header
  type: string; // account or organizational_unit
}) => {
  const newQuery: any = {
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
    ...(breadcrumbPath && { [breadcrumbPathKey]: breadcrumbPath }),
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(groupByOrg && { [orgUnitIdKey]: groupByOrg }), // Used to set group by for return link
    ...(title && { [breakdownTitleKey]: title }),
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
