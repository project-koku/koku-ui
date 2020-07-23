import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { withRouter } from 'react-router';
import { NotAuthorizedState } from './notAuthorizedState';

const NotAuthorized = () => {
  return (
    <Main>
      <NotAuthorizedState />
    </Main>
  );
};

export default withRouter(NotAuthorized);
