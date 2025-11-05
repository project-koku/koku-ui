import React from 'react';
import { OptimizationsBreakdown } from 'routes/optimizations/optimizationsBreakdown';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdownWrapper: React.FC<OptimizationsBreakdownProps> = () => {
  return (
    <OptimizationsWrapper>
      <OptimizationsBreakdown />
    </OptimizationsWrapper>
  );
};

export default OptimizationsBreakdownWrapper;
