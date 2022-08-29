import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { LoadingState } from 'routes/components/state/loadingState/loadingState';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface LoadingOwnProps {
  title?: string;
}

type LoadingProps = LoadingOwnProps & RouteComponentProps<void>;

const Loading = ({ title }: LoadingProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <LoadingState />
      </Main>
    </>
  );
};

export default withRouter(Loading);
