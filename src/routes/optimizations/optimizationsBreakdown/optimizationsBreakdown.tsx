import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import React from 'react';

import { styles } from './optimizationsBreakdown.styles';

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  return (
    <div style={styles.container}>
      <AsyncComponent scope="costManagementMfe" appName="cost-management-mfe" module="./MfeOptimizationsBreakdown" />
    </div>
  );
};

export default OptimizationsBreakdown;
