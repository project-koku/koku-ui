import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NoOptimizationsState } from './noOptimizationsState';

interface NoProvidersOwnProps {
  title?: string;
}

type NoProvidersProps = NoProvidersOwnProps;

const NoOptimizations = ({ title }: NoProvidersProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection>
        <NoOptimizationsState />
      </PageSection>
    </>
  );
};

export default NoOptimizations;
