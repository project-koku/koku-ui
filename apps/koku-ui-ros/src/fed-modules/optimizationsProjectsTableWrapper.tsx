import React from 'react';
import { OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsProjectsOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  cluster?: string[]; // Cluster name to filter by
  isClusterHidden?: boolean; // Hides cluster filter and column
  isPaginationHidden?: boolean; // Hides pagination
  isToolbarHidden?: boolean; // Hides toolbar
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string[]; // Project name to filter by
  queryStateName: string; // Name used to store link state -- details and breakdown should used same name
}

type OptimizationsProjectsProps = OptimizationsProjectsOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsProjectsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  isClusterHidden,
  isPaginationHidden,
  isToolbarHidden,
  linkPath,
  linkState,
  project,
  queryStateName,
}: OptimizationsProjectsOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsProjectsTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        cluster={cluster}
        isClusterHidden={isClusterHidden}
        isPaginationHidden={isPaginationHidden}
        isToolbarHidden={isToolbarHidden}
        linkPath={linkPath}
        linkState={linkState}
        project={project}
        queryStateName={queryStateName}
      />
    </OptimizationsWrapper>
  );
};

export default OptimizationsTableWrapper;
