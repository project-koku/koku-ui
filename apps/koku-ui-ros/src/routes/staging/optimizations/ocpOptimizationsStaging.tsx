import { PageSection } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';
import { formatPath } from 'utils/paths';

interface OcpOptimizationsStagingOwnProps {
  // TBD...
}

type OcpOptimizationsStagingProps = OcpOptimizationsStagingOwnProps;

const OcpOptimizationsStaging: React.FC<OcpOptimizationsStagingProps> = () => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <PageSection>
      <OptimizationsOcpBreakdown
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
        breadcrumbPath={formatPath(`${routes.ocpOptimizations.path}${location.search}`)}
        linkPath={formatPath(routes.ocpOptimizationsBreakdown.path)}
        linkState={{
          ...(location.state || {}),
        }}
        queryStateName="ocpOptimizationsState"
      />
    </PageSection>
  );
};

export default OcpOptimizationsStaging;
