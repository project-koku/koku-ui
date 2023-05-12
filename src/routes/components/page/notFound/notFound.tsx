import { PageSection } from '@patternfly/react-core';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import React from 'react';

const NotFound = () => {
  return (
    <PageSection>
      <InvalidObject />
    </PageSection>
  );
};

export default NotFound;
