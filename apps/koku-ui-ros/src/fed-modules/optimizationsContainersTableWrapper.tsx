import React from 'react';
import { OptimizationsContainersTable } from 'routes/optimizations/optimizationsContainersTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsContainersTableOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string[];
  hideCluster?: boolean;
  hideProject?: boolean;
  linkPath?: string;
  linkState?: any;
  project?: string[];
}

type OptimizationsContainersToolbarProps = OptimizationsContainersTableOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsContainersToolbarProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  hideCluster,
  hideProject,
  linkPath,
  linkState,
  project,
}: OptimizationsContainersTableOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsContainersTable
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
