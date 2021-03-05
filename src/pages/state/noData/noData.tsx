import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from 'components/pageHeaderTitle/pageHeaderTitle';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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
