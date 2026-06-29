import { PageSection } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';
import { getGroupByValue } from 'routes/utils/groupBy';
import { formatPath } from 'utils/paths';

interface OptimizationsProjectsTableStagingOwnProps {
  // TBD...
}

type OptimizationsProjectsTableStagingProps = OptimizationsProjectsTableStagingOwnProps;

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const OptimizationsProjectsTableStaging: React.FC<OptimizationsProjectsTableStagingProps> = () => {
  const intl = useIntl();
  const queryFromRoute = useQueryFromRoute();

  // The groupBy and groupByValue is the project, cluster, node, or tag name shown in the OCP Details breakdown page
  const groupByValue = queryFromRoute?.group_by ? getGroupByValue(queryFromRoute) : 'openshift-kube-apiserver';

  return (
    <PageSection>
      <OptimizationsProjectsTable
        breadcrumbLabel={
          intl.formatMessage(messages.breakdownBackToOptimizationsProject, { value: groupByValue }) as string
        }
        linkPath={formatPath(routes.optimizationsDetailsBreakdown.path)}
        queryStateName="optimizationsDetailsState"
      />
    </PageSection>
  );
};

export default OptimizationsProjectsTableStaging;
