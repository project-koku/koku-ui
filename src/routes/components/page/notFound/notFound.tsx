import { MissingPage } from '@patternfly/react-component-groups/dist/esm/MissingPage';
import { PageSection } from '@patternfly/react-core';
import React from 'react';

const NotFound = () => {
  return (
    <PageSection hasBodyWrapper={false}>
      <MissingPage titleText={undefined} />
    </PageSection>
  );
};

export default NotFound;
