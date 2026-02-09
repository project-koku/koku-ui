import React from 'react';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface optimizationsOcpBreakdownOwnProps {
  // TBD...
}

type optimizationsOcpBreakdownProps = optimizationsOcpBreakdownOwnProps;

const optimizationsOcpBreakdownWrapper: React.FC<optimizationsOcpBreakdownProps> = () => {
  return (
    <OptimizationsWrapper>
      <OptimizationsOcpBreakdown />
    </OptimizationsWrapper>
  );
};

export default optimizationsOcpBreakdownWrapper;
