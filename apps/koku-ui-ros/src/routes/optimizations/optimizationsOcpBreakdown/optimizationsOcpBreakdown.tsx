import { Card, CardBody, Divider } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { OptimizationsContainersTable, OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { styles } from './optimizationsOcpBreakdown.styles';
import { OptimizationsOcpBreakdownToolbar } from './optimizationsOcpBreakdownToolbar';

interface OptimizationsOcpBreakdownOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string | string[];
  isClusterHidden?: boolean;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  project?: string | string[];
  queryStateName: string;
}

type OptimizationsOcpBreakdownProps = OptimizationsOcpBreakdownOwnProps;

const OptimizationsOcpBreakdown: React.FC<OptimizationsOcpBreakdownProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  isClusterHidden,
  linkPath,
  linkState,
  project,
  queryStateName,
}) => {
  const intl = useIntl();
  const [currentInterval, setCurrentInterval] = useState(Interval.short_term);
  const [optimizationType, setOptimizationType] = useState(OptimizationType.performance);

  const handleOnIntervalSelect = (value: Interval) => {
    setCurrentInterval(value);
  };

  const handleOnOptimizationTypeSelect = (value: OptimizationType) => {
    setOptimizationType(value);
  };

  return (
    <>
      <OptimizationsOcpBreakdownToolbar
        currentInterval={currentInterval}
        onIntervalSelect={handleOnIntervalSelect}
        onOptimizationTypeSelect={handleOnOptimizationTypeSelect}
        optimizationType={optimizationType}
      />
      <Divider style={styles.divider} />
      <div style={styles.title}>{intl.formatMessage(messages.optimizationsProject)}</div>
      <Card style={styles.card}>
        <CardBody>
          <OptimizationsProjectsTable
            breadcrumbLabel={breadcrumbLabel}
            breadcrumbPath={breadcrumbPath}
            cluster={cluster}
            isClusterHidden={isClusterHidden}
            isPaginationHidden
            isToolbarHidden
            linkPath={linkPath}
            linkState={linkState}
            project={project}
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
            cluster={cluster}
            isClusterHidden={isClusterHidden}
            isProjectHidden
            linkPath={linkPath}
            linkState={linkState}
            project={project}
            queryStateName={queryStateName}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default OptimizationsOcpBreakdown;
