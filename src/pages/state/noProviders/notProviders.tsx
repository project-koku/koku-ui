import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { NoProvidersState } from './noProvidersState';

const NoProviders = () => {
  return (
    <Main>
      <NoProvidersState />
    </Main>
  );
};

export default withRouter(NoProviders);
