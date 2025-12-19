import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { MaintenanceState } from './maintenanceState';

const Maintenance = () => {
  return (
    <PageSection hasBodyWrapper={false}>
      <Card>
        <CardBody>
          <MaintenanceState />
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default Maintenance;
