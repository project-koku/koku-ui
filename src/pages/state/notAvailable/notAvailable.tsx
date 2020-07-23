import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { Unavailable } from '@redhat-cloud-services/frontend-components/components/Unavailable';
import React from 'react';
import { withRouter } from 'react-router-dom';

const NotAvailable = () => {
  return (
    <Main>
      <Unavailable />
    </Main>
  );
};

export default withRouter(NotAvailable);
