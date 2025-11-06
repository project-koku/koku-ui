import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NotConfiguredState } from './notConfiguredState';

interface NotConfiguredOwnProps {
  title?: string;
}

type NotConfiguredProps = NotConfiguredOwnProps;

const NotConfigured = ({ title }: NotConfiguredProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <NotConfiguredState />
      </PageSection>
    </>
  );
};

export default NotConfigured;
