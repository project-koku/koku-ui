import React from 'react';
import { withRouter } from 'react-router-dom';

import { InvalidObject } from '@redhat-cloud-services/frontend-components/components/InvalidObject';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';

const NotFound = () => {
  return (
    <Main>
      <InvalidObject />
    </Main>
  );
};

export default withRouter(NotFound);
