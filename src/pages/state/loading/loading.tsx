import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { LoadingState } from 'components/state/loadingState/loadingState';
import React from 'react';
import { withRouter } from 'react-router-dom';

const NoProviders = () => {
  return (
    <Main>
      <LoadingState />
    </Main>
  );
};

export default withRouter(NoProviders);
