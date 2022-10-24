import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { NoDataState } from './noDataState';

interface NoDataOwnProps {
  showReload?: boolean;
  title?: string;
}

type NoDataProps = NoDataOwnProps & RouteComponentProps<void>;

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

export default withRouter(NoData);
