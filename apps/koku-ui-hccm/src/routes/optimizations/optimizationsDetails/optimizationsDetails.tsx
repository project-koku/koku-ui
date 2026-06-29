import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface OptimizationsDetailsOwnProps {
  activeTabKey?: number;
  isHeaderHidden?: boolean;
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetails: React.FC<OptimizationsDetailsProps> = ({
  activeTabKey,
  isHeaderHidden,
}: OptimizationsDetailsOwnProps) => {
  const intl = useIntl();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const queryString = params.toString() ? '?' + params.toString() : '';

  return (
    <AsyncComponent
      scope="costManagementRos"
      module="./OptimizationsDetails"
      breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
      breadcrumbPath={`${formatPath(routes.optimizations.path)}${queryString}`}
      isHeaderHidden={isHeaderHidden}
      linkPath={formatPath(routes.optimizationsBreakdown.path)}
      linkState={{
        ...(location?.state || {}),
        efficiencyState: {
          ...(location?.state?.efficiencyState || {}),
          activeTabKey,
        },
      }}
      queryStateName="optimizationsDetailsState"
    />
  );
};

export { OptimizationsDetails };
