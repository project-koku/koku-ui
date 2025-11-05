import { PageSection } from '@patternfly/react-core';
import React from 'react';
import { routes } from 'routes';
import { OptimizationsSummary } from 'routes/optimizations/optimizationsSummary';
import { formatPath } from 'utils/paths';

interface OptimizationsSummaryStagingOwnProps {
  // TBD...
}

type OptimizationsSummaryStagingProps = OptimizationsSummaryStagingOwnProps;

const OptimizationsSummaryStaging: React.FC<OptimizationsSummaryStagingProps> = () => {
  return (
    <PageSection>
      <OptimizationsSummary linkPath={formatPath(routes.optimizationsDetails.path)} />
    </PageSection>
  );
};

export default OptimizationsSummaryStaging;
