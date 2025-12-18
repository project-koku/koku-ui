import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
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
      {title && <PageHeader title={title} />}
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <LoadingState body={body} heading={heading} />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export default Loading;
