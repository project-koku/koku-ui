import { MissingPage } from '@patternfly/react-component-groups/dist/esm/MissingPage';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

const NotFound = () => {
  return (
    <PageSection hasBodyWrapper={false}>
      <Card>
        <CardBody>
          <MissingPage titleText={undefined} />
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default NotFound;
