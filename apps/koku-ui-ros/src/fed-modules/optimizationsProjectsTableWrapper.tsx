import React from 'react';
import { OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsProjectsOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  isClusterHidden?: boolean; // Hides cluster filter and column
  isPaginationHidden?: boolean; // Hides pagination
  isToolbarHidden?: boolean; // Hides toolbar
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string; // Project name to filter by for OCP breakdown
  queryStateName: string; // Name used to store query state
}

type OptimizationsProjectsProps = OptimizationsProjectsOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsProjectsProps> = ({
  breadcrumbLabel,
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
