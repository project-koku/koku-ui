import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { NotAuthorizedState } from './notAuthorizedState';

interface NotAuthorizedOwnProps {
  serviceName?: string;
}

type NotAuthorizedProps = NotAuthorizedOwnProps & RouteComponentProps<void>;

const NotAuthorized = ({ serviceName }: NotAuthorizedProps) => {
  return (
    <Main>
      <NotAuthorizedState serviceName={serviceName} />
    </Main>
  );
};

export default withRouter(NotAuthorized);
