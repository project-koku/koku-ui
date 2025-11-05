import React from 'react';
import { OptimizationsDetails } from 'routes/optimizations/optimizationsDetails';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetailsWrapper: React.FC<OptimizationsDetailsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  linkPath,
  linkState,
  projectPath,
}: OptimizationsDetailsOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsDetails
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        linkPath={linkPath}
        linkState={linkState}
        projectPath={projectPath}
      />
    </OptimizationsWrapper>
  );
};

export default OptimizationsDetailsWrapper;
