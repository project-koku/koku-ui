import React from 'react';
import { OptimizationsDetailsTitle } from 'routes/optimizations/optimizationsDetails';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsDetailsTitleOwnProps {
  // TBD...
}

type OptimizationsDetailsTitleProps = OptimizationsDetailsTitleOwnProps;

const OptimizationsDetailsTitleWrapper: React.FC<OptimizationsDetailsTitleProps> = () => {
  return (
    <OptimizationsWrapper>
      <OptimizationsDetailsTitle />
    </OptimizationsWrapper>
  );
};

export default OptimizationsDetailsTitleWrapper;
