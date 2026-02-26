import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { OptimizationsDetails } from 'routes/optimizations/optimizationsDetails';
import { formatPath } from 'utils/paths';

interface OptimizationsDetailsStagingOwnProps {
  // TBD...
}

type OptimizationsDetailsStagingProps = OptimizationsDetailsStagingOwnProps;

const OptimizationsDetailsStaging: React.FC<OptimizationsDetailsStagingProps> = () => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <OptimizationsDetails
      breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
      breadcrumbPath={formatPath(`${routes.optimizationsDetails.path}${location.search}`)}
      linkPath={formatPath(routes.optimizationsBreakdown.path)}
      projectPath={formatPath(`${routes.optimizationsOcpBreakdown.path}`)}
    />
  );
};

export default OptimizationsDetailsStaging;
