import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';
import { LoadingState } from 'routes/components/state/loadingState';

interface LoadingOwnProps {
  body?: string;
  heading?: string;
  title?: string;
}

type LoadingProps = LoadingOwnProps;

const Loading = ({ body, heading, title }: LoadingProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <LoadingState body={body} heading={heading} />
      </PageSection>
    </>
  );
};

export default Loading;
