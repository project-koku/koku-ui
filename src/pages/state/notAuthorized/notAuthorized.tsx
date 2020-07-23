import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { NotAuthorizedState } from 'components/state/notAuthorizedState/notAuthorizedState';
import React from 'react';
import { withRouter } from 'react-router';

const NotAuthorized = () => {
  return (
    <Main>
      <NotAuthorizedState />
    </Main>
  );
};

export default withRouter(NotAuthorized);
