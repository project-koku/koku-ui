import React from 'react';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface optimizationsOcpBreakdownOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  cluster?: string[]; // Cluster name to filter by
  isClusterHidden?: boolean; // Hides cluster filter and column
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string[]; // Project name to filter by
  queryStateName: string; // Name used to store link state -- details and breakdown should used same name
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
  queryStateName,
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
        queryStateName={queryStateName}
      />
    </OptimizationsWrapper>
  );
};

export default optimizationsOcpBreakdownWrapper;
