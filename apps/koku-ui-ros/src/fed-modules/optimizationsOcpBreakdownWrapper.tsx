import React from 'react';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface optimizationsOcpBreakdownOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  isClusterHidden?: boolean; // Hides cluster filter and column
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string | string[]; // Project name to filter by
  queryStateName: string; // Name used to store query state
}

type optimizationsOcpBreakdownProps = optimizationsOcpBreakdownOwnProps;

const optimizationsOcpBreakdownWrapper: React.FC<optimizationsOcpBreakdownProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
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
