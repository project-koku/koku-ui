import Main from '@redhat-cloud-services/frontend-components/Main';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { MaintenanceState } from './maintenanceState';

const Maintenance = () => {
  return (
    <Main>
      <MaintenanceState />
    </Main>
  );
};

export default withRouter(Maintenance);
