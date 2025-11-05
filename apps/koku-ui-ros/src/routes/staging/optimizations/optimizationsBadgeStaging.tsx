import { PageSection } from '@patternfly/react-core';
import React from 'react';
import { OptimizationsBadge } from 'routes/optimizations/optimizationsBadge';

interface OptimizationsBadgeStagingOwnProps {
  // TBD...
}

type OptimizationsBadgeStagingProps = OptimizationsBadgeStagingOwnProps;

const OptimizationsBadgeStaging: React.FC<OptimizationsBadgeStagingProps> = () => {
  // Test filters
  const clusterFilter = 'aws';
  const projectFilter = 'openshift';

  return (
    <PageSection>
      <OptimizationsBadge cluster={clusterFilter} project={projectFilter} />
    </PageSection>
  );
};

export default OptimizationsBadgeStaging;
