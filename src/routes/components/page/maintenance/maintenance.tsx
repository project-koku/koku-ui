import { PageSection } from '@patternfly/react-core';
import React from 'react';

import { MaintenanceState } from './maintenanceState';

const Maintenance = () => {
  return (
    <PageSection>
      <MaintenanceState />
    </PageSection>
  );
};

export default Maintenance;
