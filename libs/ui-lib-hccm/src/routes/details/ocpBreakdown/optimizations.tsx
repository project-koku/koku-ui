import messages from '@koku-ui/i18n/locales/messages';
import { Card, CardBody } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { AsyncComponent } from '../../../init';
import { routes } from '../../../routes';
import { useQueryFromRoute, useQueryState } from '../../../utils/hooks';
import { formatPath } from '../../../utils/paths';
import { getGroupById, getGroupByValue } from '../../utils/groupBy';

interface OptimizationsOwnProps {
  // TBD...
}

type OptimizationsProps = OptimizationsOwnProps;

const Optimizations: React.FC<OptimizationsProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
  const otimizationsTab = location.search.indexOf('optimizationsTab') === -1 ? '&optimizationsTab=true' : '';

  const clusterFilter = queryState?.filter_by?.cluster;
  const isOptimizationsPath = queryFromRoute?.optimizationsPath === 'true';

  return (
    <Card>
      <CardBody>
        <AsyncComponent
          scope="costManagementRos"
          module="./OptimizationsTable"
          breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
          breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${location.search}${otimizationsTab}`)}
          cluster={clusterFilter}
          hideCluster={clusterFilter !== undefined}
          hideProject={groupBy === 'project'}
          isOptimizationsPath={isOptimizationsPath}
          linkPath={formatPath(routes.optimizationsBreakdown.path)}
          linkState={{
            ...(location.state && location.state),
          }}
          project={groupBy === 'project' ? groupByValue : undefined}
        />
      </CardBody>
    </Card>
  );
};

export { Optimizations };
