import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import React from 'react';
import { withRouter } from 'react-router-dom';

const NoProviders = () => {
  return (
    <Main>
      <NoProvidersState />
    </Main>
  );
};

export default withRouter(NoProviders);
