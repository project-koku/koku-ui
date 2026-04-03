import React from 'react';
import { OptimizationsBreakdown } from 'routes/optimizations/optimizationsBreakdown';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsBreakdownOwnProps {
  linkState?: any; // Link state used by the link displayed in each table row
  projectPath?: string; // Path used by project link displayed in the optimizations breakdown header
  queryStateName: string; // Name used to store link state -- details and breakdown should used same name
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdownWrapper: React.FC<OptimizationsBreakdownProps> = ({
  linkState,
  projectPath,
  queryStateName,
}: OptimizationsBreakdownOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsBreakdown linkState={linkState} projectPath={projectPath} queryStateName={queryStateName} />
    </OptimizationsWrapper>
  );
};

export default OptimizationsBreakdownWrapper;
