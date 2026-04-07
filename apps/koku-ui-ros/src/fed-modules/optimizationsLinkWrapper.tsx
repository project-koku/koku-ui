import React from 'react';
import { OptimizationsLink } from 'routes/optimizations/optimizationsLink';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsLinkOwnProps {
  cluster?: string | string[]; // Cluster name to filter by
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string | string[]; // Project name to filter by
}

type OptimizationsLinkProps = OptimizationsLinkOwnProps;

const OptimizationsLinkWrapper: React.FC<OptimizationsLinkProps> = ({
  cluster,
  linkPath,
  linkState,
  project,
}: OptimizationsLinkOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsLink cluster={cluster} project={project} linkState={linkState} linkPath={linkPath} />
    </OptimizationsWrapper>
  );
};

export default OptimizationsLinkWrapper;
