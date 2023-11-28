import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import { styles } from './optimizationsBreakdown.styles';

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps;

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

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
