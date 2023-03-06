import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import React from 'react';

interface NoProvidersOwnProps {
  title?: string;
}

type NotAvailableProps = NoProvidersOwnProps;

const NotAvailable = ({ title }: NotAvailableProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection>
        <Unavailable />
      </PageSection>
    </>
  );
};

export default NotAvailable;
