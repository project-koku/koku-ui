import { Card, CardBody, Divider } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { OptimizationsContainersTable, OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';
import { getQueryState } from 'routes/utils/queryState';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { styles } from './optimizationsOcpBreakdown.styles';
import { OptimizationsOcpBreakdownToolbar } from './optimizationsOcpBreakdownToolbar';

interface OptimizationsOcpBreakdownOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  isClusterHidden?: boolean; // Hides cluster filter and column
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  project?: string | string[]; // Project name to filter by
  queryStateName: string; // Name used to store query state
}

interface RosDetailsQuery {
  interval?: Interval;
  optimizationType?: OptimizationType;
}

type OptimizationsOcpBreakdownProps = OptimizationsOcpBreakdownOwnProps;

const OptimizationsOcpBreakdown: React.FC<OptimizationsOcpBreakdownProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  isClusterHidden,
  linkPath,
  linkState,
  project,
  queryStateName,
}) => {
  const location = useLocation();
  const intl = useIntl();

  const queryState = getQueryState(location, queryStateName);
  const [query, setQuery] = useState<RosDetailsQuery>({
    interval: queryState?.interval ?? Interval.short_term,
    optimizationType: queryState?.optimizationType ?? OptimizationType.performance,
  });

  const handleOnIntervalSelect = (value: Interval) => {
    setQuery({ ...query, interval: value });
  };

  const handleOnOptimizationTypeSelect = (value: OptimizationType) => {
    setQuery({ ...query, optimizationType: value });
  };

  return (
    <>
      <OptimizationsOcpBreakdownToolbar
        currentInterval={query?.interval}
        onIntervalSelect={handleOnIntervalSelect}
        onOptimizationTypeSelect={handleOnOptimizationTypeSelect}
        optimizationType={query?.optimizationType}
      />
      <Divider style={styles.divider} />
      <div style={styles.title}>{intl.formatMessage(messages.optimizationsProject)}</div>
      <Card style={styles.card}>
        <CardBody>
          <OptimizationsProjectsTable
            breadcrumbLabel={breadcrumbLabel}
            breadcrumbPath={breadcrumbPath}
            interval={query?.interval}
            isClusterHidden={isClusterHidden}
            isPaginationHidden
            isToolbarHidden
            linkPath={linkPath}
            linkState={linkState}
            optimizationType={query?.optimizationType}
            project={project}
            query={query}
            queryStateName={queryStateName}
          />
        </CardBody>
      </Card>
      <Divider style={styles.divider} />
      <div style={styles.title}>{intl.formatMessage(messages.optimizableContainers)}</div>
      <Card style={styles.card}>
        <CardBody>
          <OptimizationsContainersTable
            breadcrumbLabel={breadcrumbLabel}
            breadcrumbPath={breadcrumbPath}
            interval={query?.interval}
            isClusterHidden={isClusterHidden}
            isProjectHidden
            linkPath={linkPath}
            linkState={linkState}
            optimizationType={query?.optimizationType}
            project={project}
            query={query}
            queryStateName={queryStateName}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default OptimizationsOcpBreakdown;
