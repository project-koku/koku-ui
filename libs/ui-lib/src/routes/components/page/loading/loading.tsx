import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { PageHeader, PageHeaderTitle } from '../../../../init';
import { LoadingState } from '../../state/loadingState';

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
