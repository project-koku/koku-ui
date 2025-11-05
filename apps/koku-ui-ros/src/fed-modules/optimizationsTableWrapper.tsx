import React from 'react';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string[];
  hideCluster?: boolean;
  hideProject?: boolean;
  linkPath?: string;
  linkState?: any;
  project?: string[];
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsTableWrapper: React.FC<OptimizationsDetailsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  hideCluster,
  hideProject,
  linkPath,
  linkState,
  project,
}: OptimizationsDetailsOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsTable
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
