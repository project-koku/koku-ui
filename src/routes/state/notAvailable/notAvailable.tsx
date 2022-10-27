import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

interface NoProvidersOwnProps {
  title?: string;
}

type NotAvailableProps = NoProvidersOwnProps & RouteComponentProps<void>;

const NotAvailable = ({ title }: NotAvailableProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <Unavailable />
      </Main>
    </>
  );
};

export default withRouter(NotAvailable);
