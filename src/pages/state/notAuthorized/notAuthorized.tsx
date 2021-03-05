import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from 'components/pageHeaderTitle/pageHeaderTitle';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { NotAuthorizedState } from './notAuthorizedState';

interface NotAuthorizedOwnProps {
  pathname?: string;
  title?: string;
}

type NotAuthorizedProps = NotAuthorizedOwnProps & RouteComponentProps<void>;

const NotAuthorized = ({ pathname, title }: NotAuthorizedProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <NotAuthorizedState pathname={pathname} />
      </Main>
    </>
  );
};

export default withRouter(NotAuthorized);
