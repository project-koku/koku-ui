import { Card, CardBody } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { useQueryFromRoute, useQueryState } from 'utils/hooks';
import { formatPath } from 'utils/paths';

interface OcpOptimizationsOwnProps {
  // TBD...
}

interface OcpOptimizationsStateProps {
  isNamespaceToggleEnabled?: boolean;
}

type OcpOptimizationsProps = OcpOptimizationsOwnProps;

const OcpOptimizations: React.FC<OcpOptimizationsProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState();
  const { isNamespaceToggleEnabled } = useMapToProps();

  const clusterFilter = queryState?.filter_by?.cluster;
  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  // Set optimizationsTab query param to ensure the optimizations tab is selected upon clicking the breadcrumb
  // in OCP optimizations breakdown. In OCP details, clicking the optimizations link will add the query param, but
  // clicking "project" links will not
  const params = new URLSearchParams(location.search);
  if (!params.has('optimizationsTab')) {
    params.set('optimizationsTab', 'true');
  }
  const queryString = `?${params.toString()}`;

  if (isNamespaceToggleEnabled) {
    return (
      <AsyncComponent
        scope="costManagementRos"
        module="./OptimizationsOcpBreakdown"
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
        breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${queryString}`)}
        cluster={clusterFilter}
        isClusterHidden={clusterFilter !== undefined}
        isProjectHidden={groupBy === 'project'}
        linkPath={formatPath(routes.ocpOptimizationsBreakdown.path)}
        linkState={{
          ...(location?.state || {}),
        }}
        project={groupBy === 'project' ? groupByValue : undefined}
        queryStateName="ocpOptimizationsState"
      />
    );
  }
  return (
    <Card>
      <CardBody>
        <AsyncComponent
          scope="costManagementRos"
          module="./OptimizationsTable"
          breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
          breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${queryString}`)}
          cluster={clusterFilter}
          isClusterHidden={clusterFilter !== undefined}
          isProjectHidden={groupBy === 'project'}
          linkPath={formatPath(routes.ocpOptimizationsBreakdown.path)}
          linkState={{
            ...(location?.state || {}),
          }}
          project={groupBy === 'project' ? groupByValue : undefined}
          queryStateName="ocpOptimizationsState"
        />
      </CardBody>
    </Card>
  );
};

const useMapToProps = (): OcpOptimizationsStateProps => {
  return {
    isNamespaceToggleEnabled: useIsNamespaceToggleEnabled(),
  };
};

export { OcpOptimizations };
