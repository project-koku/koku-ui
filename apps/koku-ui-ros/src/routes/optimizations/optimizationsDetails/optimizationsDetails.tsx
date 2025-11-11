import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';
import { OptimizationsTable } from 'routes/optimizations/optimizationsTable';

import { OptimizationsDetailsHeader } from './optimizationsDetailsHeader';

interface OptimizationsDetailsOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const OptimizationsDetails: React.FC<OptimizationsDetailsProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  linkPath,
  linkState,
  projectPath,
}) => {
  return (
    <>
      <PageSection>
        <OptimizationsDetailsHeader />
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
              projectPath={projectPath}
            />
          </CardBody>
        </Card>
        ROS Konflux TEST 1
      </PageSection>
    </>
  );
};

export default OptimizationsDetails;
