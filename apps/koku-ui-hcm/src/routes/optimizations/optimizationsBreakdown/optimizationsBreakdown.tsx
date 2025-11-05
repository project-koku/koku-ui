import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import React from 'react';

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  return <AsyncComponent scope="costManagementRos" appName="cost-management-ros" module="./OptimizationsBreakdown" />;
};

export default OptimizationsBreakdown;
