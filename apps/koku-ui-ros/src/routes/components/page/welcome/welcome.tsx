import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { PageSection } from '@patternfly/react-core';
import React from 'react';

import { WelcomeState } from './welcomeState';

interface WelcomeOwnProps {
  title?: string;
}

const Welcome = ({ title }: WelcomeOwnProps) => {
  return (
    <>
      {title && <PageHeader title={title} />}
      <PageSection hasBodyWrapper={false}>
        <WelcomeState />
      </PageSection>
    </>
  );
};

export default Welcome;
