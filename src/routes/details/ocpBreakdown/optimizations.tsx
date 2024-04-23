import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { getQueryState } from 'routes/utils/queryState';
import { formatPath } from 'utils/paths';

interface OptimizationsOwnProps {
  // TBD...
}

type OptimizationsProps = OptimizationsOwnProps;

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const useQueryState = () => {
  const location = useLocation();
  return getQueryState(location, 'details');
};

const Optimizations: React.FC<OptimizationsProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
  const otimizationsTab = location.search.indexOf('optimizationsTab') === -1 ? '&optimizationsTab=true' : '';

  const clusterFilter = queryState?.filter_by?.cluster ? queryState.filter_by.cluster : undefined;

  return (
    <AsyncComponent
      scope="costManagementMfe"
      appName="cost-management-mfe"
      module="./MfeOptimizationsTable"
      breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
      breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${location.search}${otimizationsTab}`)}
      cluster={clusterFilter}
      hideCluster={clusterFilter !== undefined}
      hideProject={groupBy === 'project'}
      linkPath={formatPath(routes.optimizationsBreakdown.path)}
      linkState={{
        ...(location.state && location.state),
      }}
      project={groupBy === 'project' ? groupByValue : undefined}
    />
  );
};

export { Optimizations };
