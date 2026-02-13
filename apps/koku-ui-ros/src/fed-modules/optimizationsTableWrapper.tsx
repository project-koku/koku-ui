import React from 'react';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsTableOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string[];
  isClusterHidden?: boolean;
  isProjectHidden?: boolean;
  linkPath?: string;
  linkState?: any;
  project?: string[];
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
      />
    </OptimizationsWrapper>
  );
};

export default OptimizationsTableWrapper;
