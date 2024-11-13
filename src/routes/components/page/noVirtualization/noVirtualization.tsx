import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NoVirtualizationState } from './noVirtualizationState';

interface NoVirtualizationOwnProps {
  title?: string;
}

type NoVirtualizationProps = NoVirtualizationOwnProps;

const NoVirtualization = ({ title }: NoVirtualizationProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection>
        <NoVirtualizationState />
      </PageSection>
    </>
  );
};

export default NoVirtualization;
