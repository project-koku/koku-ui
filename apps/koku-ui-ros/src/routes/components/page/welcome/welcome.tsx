import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { WelcomeState } from './welcomeState';

interface WelcomeOwnProps {
  title?: string;
}

const Welcome = ({ title }: WelcomeOwnProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <WelcomeState />
      </PageSection>
    </>
  );
};

export default Welcome;
