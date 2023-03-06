import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';
import { LoadingState } from 'routes/components/state/loadingState';

interface LoadingOwnProps {
  title?: string;
}

type LoadingProps = LoadingOwnProps;

const Loading = ({ title }: LoadingProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection>
        <LoadingState />
      </PageSection>
    </>
  );
};

export default Loading;
