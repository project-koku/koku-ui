import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

interface NotAvailableOwnProps {
  title?: string;
}

type NotAvailableProps = NotAvailableOwnProps;

const NotAvailable = ({ title }: NotAvailableProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <Unavailable />
      </PageSection>
    </>
  );
};

export default NotAvailable;
