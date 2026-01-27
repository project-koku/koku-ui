import { Card, CardBody, PageSection } from '@patternfly/react-core';
import { RosNamespace } from 'api/ros/ros';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import React, { useState } from 'react';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { OptimizationsDetailsHeader } from './optimizationsDetailsHeader';

interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
}

interface OptimizationsDetailsStateProps {
  isNamespaceToggleEnabled?: boolean;
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetails: React.FC<OptimizationsDetailsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  linkPath,
  linkState,
  projectPath,
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
      <PageSection>
        <Card>
          <CardBody>
            <OptimizationsTable
              breadcrumbLabel={breadcrumbLabel}
              breadcrumbPath={breadcrumbPath}
              isOptimizationsDetails
              linkPath={linkPath}
              linkState={linkState}
              namespace={namespace}
              projectPath={projectPath}
            />
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
