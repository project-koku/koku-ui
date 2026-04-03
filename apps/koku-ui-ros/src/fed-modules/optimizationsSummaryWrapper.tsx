import React from 'react';
import { OptimizationsSummary } from 'routes/optimizations/optimizationsSummary';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsSummaryOwnProps {
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
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
