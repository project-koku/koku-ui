import React from 'react';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsTableOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  cluster?: string[]; // Cluster name to filter by
  isClusterHidden?: boolean; // Hides cluster filter and column
  isProjectHidden?: boolean; // Hides project filter and column
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string[]; // Project name to filter by
  queryStateName: string; // Name used to store link state -- details and breakdown should used same name
}

type OptimizationsTableProps = OptimizationsTableOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsTableProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  isClusterHidden,
  isProjectHidden,
  linkPath,
  linkState,
  project,
  queryStateName,
}: OptimizationsTableOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        cluster={cluster}
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
