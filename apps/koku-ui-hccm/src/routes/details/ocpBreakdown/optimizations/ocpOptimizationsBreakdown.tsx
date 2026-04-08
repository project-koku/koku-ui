import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import React from 'react';
import { useLocation } from 'react-router-dom';

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
        ...(location?.state || {}),
      }}
      queryStateName="ocpOptimizationsState"
    />
  );
};

export default OcpOptimizationsBreakdown;
