import { PageSection } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';
import { formatPath } from 'utils/paths';

interface OptimizationsOcpBreakdownStagingOwnProps {
  // TBD...
}

type OptimizationsOcpBreakdownStagingProps = OptimizationsOcpBreakdownStagingOwnProps;

const OptimizationsOcpBreakdownStaging: React.FC<OptimizationsOcpBreakdownStagingProps> = () => {
  const intl = useIntl();

  return (
    <PageSection>
      <OptimizationsOcpBreakdown
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
        breadcrumbPath={formatPath(`${routes.optimizationsOcpBreakdown.path}${location.search}`)}
        linkPath={formatPath(routes.optimizationsBreakdown.path)}
        projectPath={formatPath(`${routes.optimizationsContainersTable.path}`)}
      />
    </PageSection>
  );
};

export default OptimizationsOcpBreakdownStaging;
