import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { useQueryFromRoute } from 'utils/hooks';
import { formatPath } from 'utils/paths';

import { styles } from './optimizationsBreakdown.styles';

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  const intl = useIntl();
  const queryFromRoute = useQueryFromRoute();

  return (
    <div style={styles.container}>
      <AsyncComponent
        scope="costManagementMfe"
        appName="cost-management-mfe"
        module="./MfeOptimizationsBreakdown"
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
        breadcrumbPath={formatPath(routes.optimizationsDetails.path)}
        id={queryFromRoute ? queryFromRoute.id : ''}
      />
    </div>
  );
};

export default OptimizationsBreakdown;
