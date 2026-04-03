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
        ...(location.state && location.state),
        detailsState: {
          ...(location.state?.optimizationsDetails && location.state?.optimizationsDetails),
          breadcrumbPath: formatPath(`${routes.optimizationsBreakdown.path}${location.search}`),
        },
        ocpOptimizationsState: undefined, // Clear state, to reinitialize optimizations tab in OCP breakdown
      }}
      projectPath={formatPath(routes.ocpBreakdown.path)} // Path for optimizations breakdown project link
      queryStateName="optimizationsDetailsState"
    />
  );
};

export default OptimizationsBreakdown;
