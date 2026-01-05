import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { NoInstancesState } from './noInstancesState';

interface NoInstancesOwnProps {
  isPageSection?: boolean;
  title?: string;
}

type NoInstancesProps = NoInstancesOwnProps;

const NoInstances = ({ isPageSection = true, title }: NoInstancesProps) => {
  const content = (
    <Card>
      <CardBody>
        <NoInstancesState />
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

export default NoInstances;
