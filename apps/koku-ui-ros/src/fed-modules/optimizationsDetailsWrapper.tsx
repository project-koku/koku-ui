import React from 'react';
import { OptimizationsDetails } from 'routes/optimizations/optimizationsDetails';

import { OptimizationsWrapper } from './optimizationsWrapper';

export interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page header
  breadcrumbPath?: string; // Breadcrumb path used in the page header
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  queryStateName: string; // Name used to store query state
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetailsWrapper: React.FC<OptimizationsDetailsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  linkPath,
  linkState,
  queryStateName,
}: OptimizationsDetailsOwnProps) => {
  return (
    <OptimizationsWrapper>
      <OptimizationsDetails
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        linkPath={linkPath}
        linkState={linkState}
        queryStateName={queryStateName}
      />
    </OptimizationsWrapper>
  );
};

export default OptimizationsDetailsWrapper;
