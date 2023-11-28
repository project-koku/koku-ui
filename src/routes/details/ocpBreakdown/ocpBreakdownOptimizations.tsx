import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { formatPath } from 'utils/paths';

interface OcpOptimizationsBreakdownOwnProps {
  // TBD...
}

type OcpOptimizationsBreakdownProps = OcpOptimizationsBreakdownOwnProps;

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const OcpBreakdownOptimizations: React.FC<OcpOptimizationsBreakdownProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryFromRoute = useQueryFromRoute();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
  const otimizationsTab = location.search.indexOf('optimizationsTab') === -1 ? '&optimizationsTab=true' : '';

  return (
    <AsyncComponent
      scope="costManagementMfe"
      appName="cost-management-mfe"
      module="./MfeOptimizationsTable"
      breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
      breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${location.search}${otimizationsTab}`)}
      groupBy={groupBy}
      groupByValue={groupByValue}
      isProject={false}
      linkPath={formatPath(routes.optimizationsBreakdown.path)}
      linkState={{
        ...(location.state && location.state),
      }}
    />
  );
};

export { OcpBreakdownOptimizations };
