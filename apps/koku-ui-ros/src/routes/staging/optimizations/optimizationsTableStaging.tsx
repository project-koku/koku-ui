import { PageSection } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { formatPath } from 'utils/paths';

interface OptimizationsTableStagingOwnProps {
  // TBD...
}

type OptimizationsTableStagingProps = OptimizationsTableStagingOwnProps;

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const OptimizationsTableStaging: React.FC<OptimizationsTableStagingProps> = () => {
  const intl = useIntl();
  const queryFromRoute = useQueryFromRoute();

  // The groupBy and groupByValue is the project, cluster, node, or tag name shown in the OCP Details breakdown page
  const groupBy = queryFromRoute?.group_by ? getGroupById(queryFromRoute) : undefined;
  const groupByValue = queryFromRoute?.group_by ? getGroupByValue(queryFromRoute) : 'openshift-kube-apiserver';

  // Test filters
  const clusterFilter = 'aws';
  const projectFilter = 'openshift';

  return (
    <PageSection>
      <OptimizationsTable
        breadcrumbLabel={
          intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue }) as string
        }
        breadcrumbPath={formatPath(`${routes.optimizationsTable.path}${location.search}`)}
        cluster={clusterFilter}
        isClusterHidden={groupBy === 'cluster'}
        isProjectHidden={groupBy === 'project'}
        project={projectFilter}
        linkPath={formatPath(routes.optimizationsBreakdown.path)}
      />
    </PageSection>
  );
};

export default OptimizationsTableStaging;
