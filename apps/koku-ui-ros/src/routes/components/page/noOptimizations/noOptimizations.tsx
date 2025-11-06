import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NoOptimizationsState } from './noOptimizationsState';

interface NoOptimizationsOwnProps {
  title?: string;
}

type NoOptimizationsProps = NoOptimizationsOwnProps;

const NoOptimizations = ({ title }: NoOptimizationsProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <NoOptimizationsState />
      </PageSection>
    </>
  );
};

export default NoOptimizations;
