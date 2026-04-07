import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface OcpOptimizationsBreakdownOwnProps {
  // TBD...
}

type OcpOptimizationsBreakdownProps = OcpOptimizationsBreakdownOwnProps;

const OcpOptimizationsBreakdown: React.FC<OcpOptimizationsBreakdownProps> = () => {
  const location = useLocation();

  return (
    <AsyncComponent
      scope="costManagementRos"
      appName="cost-management-ros"
      module="./OptimizationsBreakdown"
      linkState={{
        ...(location.state || {}),
        ...(location.state?.optimizationsDetails && {
          optimizationsDetails: {
            ...(location.state?.optimizationsDetails || {}),
            breadcrumbPath: formatPath(`${routes.optimizationsBreakdown.path}${location.search}`),
          },
        }),
      }}
      queryStateName="ocpOptimizationsState"
    />
  );
};

export default OcpOptimizationsBreakdown;
