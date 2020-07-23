import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { MaintenanceState } from 'components/state/maintenanceState/maintenanceState';
import React from 'react';
import { withRouter } from 'react-router-dom';

const Maintenance = () => {
  return (
    <Main>
      <MaintenanceState />
    </Main>
  );
};

export default withRouter(Maintenance);
