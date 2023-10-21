import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import { styles } from './optimizationsDetails.styles';

interface OptimizationsDetailsOwnProps {
  // TBD...
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetails: React.FC<OptimizationsDetailsProps> = () => {
  const intl = useIntl();

  return (
    <div style={styles.container}>
      <AsyncComponent
        scope="costManagementMfe"
        appName="cost-management-mfe"
        module="./MfeOptimizationsDetails"
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
        breadcrumbPath={formatPath(`${routes.optimizationsDetails.path}${location.search}`)}
        toPath={formatPath(routes.optimizationsBreakdown.path)}
      />
    </div>
  );
};

export default OptimizationsDetails;
