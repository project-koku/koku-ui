import React from 'react';
import { OptimizationsLink } from 'routes/optimizations/optimizationsLink';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsBadgeOwnProps {
  cluster?: string | string[];
  linkPath?: string;
  linkState?: any;
  project?: string | string[];
}

type OptimizationsBadgeProps = OptimizationsBadgeOwnProps;

const OptimizationsLinkWrapper: React.FC<OptimizationsBadgeProps> = ({
  cluster,
  linkPath,
  linkState,
  project,
}: OptimizationsBadgeOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsLink cluster={cluster} project={project} linkState={linkState} linkPath={linkPath} />
    </OptimizationsWrapper>
  );
};

export default OptimizationsLinkWrapper;
