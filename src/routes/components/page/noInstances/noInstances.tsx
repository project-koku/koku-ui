import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NoInstancesState } from './noInstancesState';

interface NoInstancesOwnProps {
  title?: string;
}

type NoInstancesProps = NoInstancesOwnProps;

const NoInstances = ({ title }: NoInstancesProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <NoInstancesState />
      </PageSection>
    </>
  );
};

export default NoInstances;
