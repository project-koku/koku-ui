import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { OptimizationsBreakdown } from 'routes/optimizations/optimizationsBreakdown';
import { formatPath } from 'utils/paths';

interface OptimizationsBreakdownStagingOwnProps {
  // TBD...
}

type OptimizationsBreakdownStagingProps = OptimizationsBreakdownStagingOwnProps;

const OptimizationsDetailsBreakdownStaging: React.FC<OptimizationsBreakdownStagingProps> = () => {
  const location = useLocation();

  return (
    <OptimizationsBreakdown
      projectPath={formatPath(`${routes.ocpOptimizations.path}`)} // Path for optimizations breakdown project link
      linkState={{
        ...(location.state || {}),
        ocpOptimizationsState: undefined, // Clear state, to reinitialize optimizations tab in OCP breakdown
      }}
      queryStateName="optimizationsDetailsState"
    />
  );
};

export default OptimizationsDetailsBreakdownStaging;
