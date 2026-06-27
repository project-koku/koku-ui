import { Card, CardBody, PageSection } from '@patternfly/react-core';
import { RosNamespace } from 'api/ros/ros';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OptimizationsContainersTable, OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';
import { getQueryState } from 'routes/utils/queryState';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { OptimizationsDetailsHeader } from './optimizationsDetailsHeader';

interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  isHeaderHidden?: boolean; // Hides header for use in OCP optimizations breakdown
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  queryStateName: string; // Name used to store query state
}

interface OptimizationsDetailsStateProps {
  isNamespaceToggleEnabled?: boolean;
}

export interface RosDetailsQuery {
  interval?: Interval;
  namespace?: RosNamespace;
  optimizationType?: OptimizationType;
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetails: React.FC<OptimizationsDetailsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  isHeaderHidden = false,
  linkPath,
  linkState,
  queryStateName,
}) => {
  const location = useLocation();

  const { isNamespaceToggleEnabled } = useMapToProps();
  const queryState = getQueryState(location, queryStateName);
  const [query, setQuery] = useState<RosDetailsQuery>({
    interval: queryState?.interval ?? Interval.short_term,
    namespace: queryState?.namespace ?? (isNamespaceToggleEnabled ? RosNamespace.projects : RosNamespace.containers),
    optimizationType: queryState?.optimizationType ?? OptimizationType.performance,
  });

  // Handlers

  const handleOnIntervalSelect = (value: Interval) => {
    setQuery({ ...query, interval: value });
  };

  const handleOnNamespaceSelect = (value: RosNamespace) => {
    setQuery({ ...query, namespace: value });
  };

  const handleOnOptimizationTypeSelect = (value: OptimizationType) => {
    setQuery({ ...query, optimizationType: value });
  };

  return (
    <>
      {!isHeaderHidden && (
        <PageSection>
          <OptimizationsDetailsHeader
            interval={query?.interval}
            namespace={query?.namespace}
            onIntervalSelect={handleOnIntervalSelect}
            onNamespaceSelect={handleOnNamespaceSelect}
            onOptimizationTypeSelect={handleOnOptimizationTypeSelect}
            optimizationType={query?.optimizationType}
          />
        </PageSection>
      )}
      <PageSection>
        <Card>
          <CardBody>
            {isNamespaceToggleEnabled ? (
              query?.namespace === RosNamespace.containers ? (
                <OptimizationsContainersTable
                  breadcrumbLabel={breadcrumbLabel}
                  breadcrumbPath={breadcrumbPath}
                  interval={query?.interval}
                  linkPath={linkPath}
                  linkState={linkState}
                  optimizationType={query?.optimizationType}
                  query={query}
                  queryStateName={queryStateName}
                />
              ) : (
                <OptimizationsProjectsTable
                  breadcrumbLabel={breadcrumbLabel}
                  breadcrumbPath={breadcrumbPath}
                  interval={query?.interval}
                  linkPath={linkPath}
                  linkState={linkState}
                  optimizationType={query?.optimizationType}
                  query={query}
                  queryStateName={queryStateName}
                />
              )
            ) : (
              <OptimizationsTable
                breadcrumbLabel={breadcrumbLabel}
                breadcrumbPath={breadcrumbPath}
                linkPath={linkPath}
                linkState={linkState}
                queryStateName={queryStateName}
              />
            )}
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

const useMapToProps = (): OptimizationsDetailsStateProps => {
  return {
    isNamespaceToggleEnabled: useIsNamespaceToggleEnabled(),
  };
};

export default OptimizationsDetails;
