import { Card, CardBody, PageSection } from '@patternfly/react-core';
import { RosNamespace } from 'api/ros/ros';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import React, { useState } from 'react';
import { OptimizationsContainersTable, OptimizationsProjectsTable } from 'routes/optimizations/optimizationsTable';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { OptimizationsDetailsHeader } from './optimizationsDetailsHeader';

interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  isHeaderHidden?: boolean;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  queryStateName: string;
}

interface OptimizationsDetailsStateProps {
  isNamespaceToggleEnabled?: boolean;
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
  const { isNamespaceToggleEnabled } = useMapToProps();
  const [currentInterval, setCurrentInterval] = useState(Interval.short_term);
  const [namespace, setNamespace] = useState(
    isNamespaceToggleEnabled ? RosNamespace.projects : RosNamespace.containers
  );
  const [optimizationType, setOptimizationType] = useState(OptimizationType.performance);

  const handleOnIntervalSelect = (value: Interval) => {
    setCurrentInterval(value);
  };

  const handleOnNamespaceSelect = (value: RosNamespace) => {
    setNamespace(value);
  };

  const handleOnOptimizationTypeSelect = (value: OptimizationType) => {
    setOptimizationType(value);
  };

  return (
    <>
      {!isHeaderHidden && (
        <PageSection>
          <OptimizationsDetailsHeader
            currentInterval={currentInterval}
            namespace={namespace}
            onIntervalSelect={handleOnIntervalSelect}
            onNamespaceSelect={handleOnNamespaceSelect}
            onOptimizationTypeSelect={handleOnOptimizationTypeSelect}
            optimizationType={optimizationType}
          />
        </PageSection>
      )}
      <PageSection>
        <Card>
          <CardBody>
            {isNamespaceToggleEnabled ? (
              namespace === RosNamespace.containers ? (
                <OptimizationsContainersTable
                  breadcrumbLabel={breadcrumbLabel}
                  breadcrumbPath={breadcrumbPath}
                  linkPath={linkPath}
                  linkState={linkState}
                  queryStateName={queryStateName}
                />
              ) : (
                <OptimizationsProjectsTable
                  breadcrumbLabel={breadcrumbLabel}
                  breadcrumbPath={breadcrumbPath}
                  linkPath={linkPath}
                  linkState={linkState}
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
