import React from 'react';
import { OptimizationsSummary } from 'routes/optimizations/optimizationsSummary';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsSummaryOwnProps {
  linkPath?: string;
  linkState?: any;
}

type OptimizationsSummaryProps = OptimizationsSummaryOwnProps;

const OptimizationsSummaryWrapper: React.FC<OptimizationsSummaryProps> = ({
  linkPath,
  linkState,
}: OptimizationsSummaryOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsSummary linkPath={linkPath} linkState={linkState} />
    </OptimizationsWrapper>
  );
};

export default OptimizationsSummaryWrapper;
