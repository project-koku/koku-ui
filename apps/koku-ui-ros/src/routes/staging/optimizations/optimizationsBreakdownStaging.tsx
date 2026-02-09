import React from 'react';
import { OptimizationsBreakdown } from 'routes/optimizations/optimizationsBreakdown';

interface OptimizationsBreakdownStagingOwnProps {
  // TBD...
}

type OptimizationsBreakdownStagingProps = OptimizationsBreakdownStagingOwnProps;

const OptimizationsBreakdownStaging: React.FC<OptimizationsBreakdownStagingProps> = () => {
  return <OptimizationsBreakdown />;
};

export default OptimizationsBreakdownStaging;
