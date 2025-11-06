import React from 'react';
import { OptimizationsBadge } from 'routes/optimizations/optimizationsBadge';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsBadgeOwnProps {
  cluster?: string | string[];
  project?: string | string[];
}

type OptimizationsBadgeProps = OptimizationsBadgeOwnProps;

const OptimizationsBadgeWrapper: React.FC<OptimizationsBadgeProps> = ({
  cluster,
  project,
}: OptimizationsBadgeOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsBadge cluster={cluster} project={project} />
    </OptimizationsWrapper>
  );
};

export default OptimizationsBadgeWrapper;
