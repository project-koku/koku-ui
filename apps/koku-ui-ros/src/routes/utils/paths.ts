import { getQueryRoute } from 'api/queries/query';
import { breadcrumbLabelKey, breadcrumbPathKey, breakdownDescKey, breakdownTitleKey } from 'utils/props';

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
  breadcrumbPath?: string; // Used as breadcrumb path in the breakdown header
  description?: string; // Used to display a description in the breakdown header
  groupBy: string | number;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isPlatformCosts?: boolean;
  isOptimizationsTab?: boolean;
  title?: string | number; // Used to display a title in the breakdown header
}) => {
  const newQuery: any = {
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
    ...(breadcrumbPath && { [breadcrumbPathKey]: breadcrumbPath }),
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(isOptimizationsTab && { optimizationsTab: true }),
    ...(title && { [breakdownTitleKey]: title }),
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
  breadcrumbPath,
  id,
  isContainers,
  title,
}: {
  basePath?: string;
  breadcrumbLabel?: string; // Used to display a breadcrumb in the breakdown header
  breadcrumbPath?: string; // Used for breadcrumb path in the breakdown header
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isContainers?: boolean; // Flag indicating to use containers API
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const newQuery: any = {
    id,
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
    ...(breadcrumbPath && { [breadcrumbPathKey]: breadcrumbPath }),
    ...(isContainers && { isContainers }),
    ...(title && { [breakdownTitleKey]: title }),
  };
  return `${basePath}?${getQueryRoute(newQuery)}`;
};
