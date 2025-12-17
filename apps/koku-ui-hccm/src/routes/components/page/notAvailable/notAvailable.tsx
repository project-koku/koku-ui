import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

interface NoProvidersOwnProps {
  isPageSection?: boolean;
  title?: string;
}

type NotAvailableProps = NoProvidersOwnProps;

const NotAvailable = ({ isPageSection = true, title }: NotAvailableProps) => {
  const content = (
    <Card>
      <CardBody>
        <Unavailable />
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

export default NotAvailable;
