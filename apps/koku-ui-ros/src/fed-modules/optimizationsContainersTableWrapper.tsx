import React from 'react';
import { OptimizationsContainersTable } from 'routes/optimizations/optimizationsContainersTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsContainersTableOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string[];
  isClusterHidden?: boolean;
  isProjectHidden?: boolean;
  linkPath?: string;
  linkState?: any;
  project?: string[];
}

type OptimizationsContainersToolbarProps = OptimizationsContainersTableOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsContainersToolbarProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  isClusterHidden,
  isProjectHidden,
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
