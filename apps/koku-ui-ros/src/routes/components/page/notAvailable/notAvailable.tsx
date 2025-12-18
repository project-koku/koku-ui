import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { PageSection } from '@patternfly/react-core';
import React from 'react';

interface NotAvailableOwnProps {
  title?: string;
}

type NotAvailableProps = NotAvailableOwnProps;

const NotAvailable = ({ title }: NotAvailableProps) => {
  return (
    <>
      {title && <PageHeader title={title} />}
      <PageSection hasBodyWrapper={false}>
        <Unavailable />
      </PageSection>
    </>
  );
};

export default NotAvailable;
