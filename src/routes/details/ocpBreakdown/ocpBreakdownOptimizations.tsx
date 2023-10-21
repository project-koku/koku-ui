import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { Query } from '@testing-library/react';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';
import { breakdownTitleKey } from 'utils/props';

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

  const project = queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : '';
  const otimizationsTab = location.search.indexOf('optimizationsTab') === -1 ? '&optimizationsTab=true' : '';

  return (
    <AsyncComponent
      scope="costManagementMfe"
      appName="cost-management-mfe"
      module="./MfeOptimizationsTable"
      breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: project })}
      breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${location.search}${otimizationsTab}`)}
      toPath={formatPath(routes.optimizationsBreakdown.path)}
    />
  );
};

export { OcpBreakdownOptimizations };
