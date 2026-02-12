import React from 'react';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface optimizationsOcpBreakdownOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string[];
  isClusterHidden?: boolean;
  linkPath?: string;
  linkState?: any;
  project?: string[];
}

type optimizationsOcpBreakdownProps = optimizationsOcpBreakdownOwnProps;

const optimizationsOcpBreakdownWrapper: React.FC<optimizationsOcpBreakdownProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  isClusterHidden,
  linkPath,
  linkState,
  project,
}: optimizationsOcpBreakdownOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsOcpBreakdown
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        cluster={cluster}
        isClusterHidden={isClusterHidden}
        linkPath={linkPath}
        linkState={linkState}
        project={project}
      />
    </OptimizationsWrapper>
  );
};

export default optimizationsOcpBreakdownWrapper;
