import React from 'react';
import { OptimizationsBreakdown } from 'routes/optimizations/optimizationsBreakdown';

interface OptimizationsDetailsStagingOwnProps {
  // TBD...
}

type OptimizationsDetailsStagingProps = OptimizationsDetailsStagingOwnProps;

const OptimizationsDetailsStaging: React.FC<OptimizationsDetailsStagingProps> = () => {
  return <OptimizationsBreakdown />;
};

export default OptimizationsDetailsStaging;
