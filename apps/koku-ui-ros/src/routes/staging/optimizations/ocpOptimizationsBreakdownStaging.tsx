import React from 'react';
import { useLocation } from 'react-router-dom';
import { OptimizationsBreakdown } from 'routes/optimizations/optimizationsBreakdown';

interface OcpOptimizationsBreakdownStagingOwnProps {
  // TBD...
}

type OcpOptimizationsBreakdownStagingProps = OcpOptimizationsBreakdownStagingOwnProps;

const OcpOptimizationsBreakdownStaging: React.FC<OcpOptimizationsBreakdownStagingProps> = () => {
  const location = useLocation();

  return (
    <OptimizationsBreakdown
      linkState={{
        ...(location.state || {}),
      }}
      queryStateName="ocpOptimizationsState"
    />
  );
};

export default OcpOptimizationsBreakdownStaging;
