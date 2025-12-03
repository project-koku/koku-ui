import React from 'react';

import { AsyncComponent } from '../../../init';

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  return <AsyncComponent scope="costManagementRos" appName="cost-management-ros" module="./OptimizationsBreakdown" />;
};

export default OptimizationsBreakdown;
