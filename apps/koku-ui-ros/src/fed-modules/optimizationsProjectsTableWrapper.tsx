import React from 'react';
import { OptimizationsProjectsTable } from 'routes/optimizations/optimizationsProjectsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsProjectsOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string[];
  hideCluster?: boolean;
  hideProject?: boolean;
  linkPath?: string;
  linkState?: any;
  project?: string[];
}

type OptimizationsProjectsProps = OptimizationsProjectsOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsProjectsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  hideCluster,
  hideProject,
  linkPath,
  linkState,
  project,
}: OptimizationsProjectsOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsProjectsTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        cluster={cluster}
        hideCluster={hideCluster}
        hideProject={hideProject}
        linkPath={linkPath}
        linkState={linkState}
        project={project}
      />
    </OptimizationsWrapper>
  );
};

export default OptimizationsTableWrapper;
