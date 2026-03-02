import { PageSection } from '@patternfly/react-core';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { OptimizationsLink } from 'routes/optimizations/optimizationsLink';
import { getBreakdownPath } from 'routes/utils/paths';
import { formatPath } from 'utils/paths';

interface OptimizationsLinkStagingOwnProps {
  // TBD...
}

type OptimizationsLinkStagingProps = OptimizationsLinkStagingOwnProps;

const OptimizationsLinkStaging: React.FC<OptimizationsLinkStagingProps> = () => {
  const location = useLocation();

  // Test filters
  const clusterFilter = 'aws';
  const projectFilter = 'openshift';

  const state = {
    ...(location.state && location.state),
    details: {
      breadcrumbPath: formatPath(routes.optimizationsLink.path),
    },
  };

  const linkPath = getBreakdownPath({
    basePath: formatPath(routes.optimizationsContainersTable.path),
    groupBy: 'project',
    id: 'openshift', // groupByValue
  });

  return (
    <PageSection>
      <OptimizationsLink cluster={clusterFilter} project={projectFilter} linkPath={linkPath} linkState={state} />
    </PageSection>
  );
};

export default OptimizationsLinkStaging;
