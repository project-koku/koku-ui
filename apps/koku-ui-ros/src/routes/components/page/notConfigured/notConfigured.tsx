import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { PageSection } from '@patternfly/react-core';
import React from 'react';

import { NotConfiguredState } from './notConfiguredState';

interface NotConfiguredOwnProps {
  title?: string;
}

type NotConfiguredProps = NotConfiguredOwnProps;

const NotConfigured = ({ title }: NotConfiguredProps) => {
  return (
    <>
      {title && <PageHeader title={title} />}
      <PageSection hasBodyWrapper={false}>
        <NotConfiguredState />
      </PageSection>
    </>
  );
};

export default NotConfigured;
