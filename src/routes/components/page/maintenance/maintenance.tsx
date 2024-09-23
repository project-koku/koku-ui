import { PageSection } from '@patternfly/react-core';
import React from 'react';

import { MaintenanceState } from './maintenanceState';

const Maintenance = () => {
  return (
    <PageSection hasBodyWrapper={false}>
      <MaintenanceState />
    </PageSection>
  );
};

export default Maintenance;
