import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { PageHeader, PageHeaderTitle } from '../../../../init';

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
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      {isPageSection ? <PageSection hasBodyWrapper={true}>{content}</PageSection> : content}
    </>
  );
};

export default NotAvailable;
