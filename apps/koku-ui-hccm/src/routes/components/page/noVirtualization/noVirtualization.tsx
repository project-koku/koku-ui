import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { NoVirtualizationState } from './noVirtualizationState';

interface NoVirtualizationOwnProps {
  isPageSection?: boolean;
  title?: string;
}

type NoVirtualizationProps = NoVirtualizationOwnProps;

const NoVirtualization = ({ isPageSection = true, title }: NoVirtualizationProps) => {
  const content = (
    <Card>
      <CardBody>
        <NoVirtualizationState />
      </CardBody>
    </Card>
  );
  return (
    <>
      {title && <PageHeader title={title} />}
      {isPageSection ? <PageSection hasBodyWrapper={true}>{content}</PageSection> : content}
    </>
  );
};

export default NoVirtualization;
