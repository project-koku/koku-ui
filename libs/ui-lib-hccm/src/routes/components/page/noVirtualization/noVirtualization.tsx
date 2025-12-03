import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { PageHeader, PageHeaderTitle } from '../../../../init';
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
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      {isPageSection ? <PageSection hasBodyWrapper={true}>{content}</PageSection> : content}
    </>
  );
};

export default NoVirtualization;
