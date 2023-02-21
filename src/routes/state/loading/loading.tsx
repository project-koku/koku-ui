import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';
import { LoadingState } from 'routes/components/state/loadingState';

interface LoadingOwnProps {
  title?: string;
}

type LoadingProps = LoadingOwnProps;

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

export default Loading;
