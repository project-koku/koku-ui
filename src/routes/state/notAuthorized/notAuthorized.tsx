import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NotAuthorizedState } from './notAuthorizedState';

interface NotAuthorizedOwnProps {
  pathname?: string;
  title?: string;
}

type NotAuthorizedProps = NotAuthorizedOwnProps;

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

export default NotAuthorized;
