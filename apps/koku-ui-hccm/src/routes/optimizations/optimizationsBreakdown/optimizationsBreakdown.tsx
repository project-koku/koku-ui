import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  const location = useLocation();

  return (
    <AsyncComponent
      scope="costManagementRos"
      appName="cost-management-ros"
      module="./OptimizationsBreakdown"
      linkState={{
        ...(location?.state || {}),
        ocpOptimizationsState: undefined, // Clear state to initialize optimizations tab
      }}
      projectPath={formatPath(routes.ocpBreakdown.path)} // Base path only, query params will be added via ProjectLink
      queryStateName="optimizationsDetailsState"
    />
  );
};

export default OptimizationsBreakdown;
