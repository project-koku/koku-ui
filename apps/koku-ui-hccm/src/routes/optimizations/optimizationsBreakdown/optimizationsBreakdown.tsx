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
        // When user clicks the optimizations breakdown "project" link, the user navigates to the OCP breakdown page
        // The properties below are overridden to initialize the optimizations tab and breadcrumb path for that page
        detailsState: {
          ...(location?.state?.detailsState || {}),
          // Breadcrumb should return to optimizations breakdown
          breadcrumbPath: formatPath(`${routes.optimizationsBreakdown.path}${location.search}`),
        },
        ocpOptimizationsState: undefined, // Clear state to initialize optimizations tab
      }}
      projectPath={formatPath(routes.ocpBreakdown.path)} // Path for "project" link
      queryStateName="optimizationsDetailsState"
    />
  );
};

export default OptimizationsBreakdown;
