import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NoDataState } from './noDataState';

interface NoDataOwnProps {
  showReload?: boolean;
  title?: string;
}

type NoDataProps = NoDataOwnProps;

const NoData = ({ showReload, title }: NoDataProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <NoDataState showReload={showReload} />
      </Main>
    </>
  );
};

export default NoData;
