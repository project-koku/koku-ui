import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { ProviderType } from 'api/providers';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { NotAuthorizedState } from './notAuthorizedState';

interface NotAuthorizedOwnProps {
  providerType?: ProviderType;
  title?: string;
}

type NotAuthorizedProps = NotAuthorizedOwnProps & RouteComponentProps<void>;

const NotAuthorized = ({ providerType, title }: NotAuthorizedProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <NotAuthorizedState providerType={providerType} />
      </Main>
    </>
  );
};

export default withRouter(NotAuthorized);
