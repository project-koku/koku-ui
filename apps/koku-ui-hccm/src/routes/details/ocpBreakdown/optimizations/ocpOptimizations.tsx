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

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  const params = new URLSearchParams(location.search);
  const optimizationsTab = !params.has('optimizationsTab') ? `${location.search ? '&' : '?'}optimizationsTab=true` : '';

  const clusterFilter = queryState?.filter_by?.cluster;
  const isOptimizationsPath = queryFromRoute?.optimizationsPath === 'true';

  if (isNamespaceToggleEnabled) {
    return (
      <AsyncComponent
        scope="costManagementRos"
        module="./OptimizationsOcpBreakdown"
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue })}
        breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${location.search}${optimizationsTab}`)}
        cluster={clusterFilter}
        isClusterHidden={clusterFilter !== undefined}
        isProjectHidden={groupBy === 'project'}
        isOptimizationsPath={isOptimizationsPath}
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
          breadcrumbPath={formatPath(`${routes.ocpBreakdown.path}${location.search}${optimizationsTab}`)}
          cluster={clusterFilter}
          isClusterHidden={clusterFilter !== undefined}
          isProjectHidden={groupBy === 'project'}
          isOptimizationsPath={isOptimizationsPath}
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
