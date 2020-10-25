import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { ProviderType } from 'api/providers';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { NoProvidersState } from './noProvidersState';

interface NoProvidersOwnProps {
  providerType?: ProviderType;
  title?: string;
}

type NoProvidersProps = NoProvidersOwnProps & RouteComponentProps<void>;

const NoProviders = ({ providerType, title }: NoProvidersProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <NoProvidersState providerType={providerType} />
      </Main>
    </>
  );
};

export default withRouter(NoProviders);
