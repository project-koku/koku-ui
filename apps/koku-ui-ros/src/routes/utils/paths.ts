import { getQueryRoute } from 'api/queries/query';
import { breadcrumbLabelKey, breakdownDescKey, breakdownTitleKey } from 'utils/props';

export const getBreakdownPath = ({
  basePath,
  breadcrumbLabel,
  description,
  groupBy,
  id,
  isPlatformCosts,
  isOptimizationsTab,
  title,
}: {
  basePath: string;
  breadcrumbLabel?: string; // Used to display a breadcrumb in the breakdown header
  description?: string; // Used to display a description in the breakdown header
  groupBy: string | number;
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isPlatformCosts?: boolean;
  isOptimizationsTab?: boolean;
  title?: string | number; // Used to display a title in the breakdown header
}) => {
  const newQuery: any = {
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
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
  id,
  isOptimizationsDetails,
  title,
}: {
  basePath?: string;
  breadcrumbLabel?: string; // Used to display a breadcrumb in the breakdown header
  id: string | number; // group_by[account]=<id> param in the breakdown page
  isOptimizationsDetails?: boolean;
  title: string | number; // Used to display a title in the breakdown header
}) => {
  const newQuery: any = {
    id,
    ...(breadcrumbLabel && { [breadcrumbLabelKey]: breadcrumbLabel }),
    ...(isOptimizationsDetails && { isOptimizationsDetails: true }),
    ...(title && { [breakdownTitleKey]: title }),
  };
  return `${basePath}?${getQueryRoute(newQuery)}`;
};
