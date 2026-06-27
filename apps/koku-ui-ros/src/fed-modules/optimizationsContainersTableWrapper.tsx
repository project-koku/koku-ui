import React from 'react';
import { OptimizationsContainersTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsContainersTableOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  isClusterHidden?: boolean; // Hides cluster filter and column
  isProjectHidden?: boolean; // Hides project filter and column
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string | string[]; // Project name to filter by
  queryStateName: string; // Name used to store query state
}

type OptimizationsContainersToolbarProps = OptimizationsContainersTableOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsContainersToolbarProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  isClusterHidden,
  isProjectHidden,
  linkPath,
  linkState,
  project,
  queryStateName,
}: OptimizationsContainersTableOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsContainersTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        isClusterHidden={isClusterHidden}
        isProjectHidden={isProjectHidden}
        linkPath={linkPath}
        linkState={linkState}
        project={project}
        queryStateName={queryStateName}
      />
    </OptimizationsWrapper>
  );
};

export default OptimizationsTableWrapper;
