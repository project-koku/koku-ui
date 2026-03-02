import React from 'react';
import { OptimizationsLink } from 'routes/optimizations/optimizationsLink';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsLinkOwnProps {
  cluster?: string | string[];
  linkPath?: string;
  linkState?: any;
  project?: string | string[];
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
