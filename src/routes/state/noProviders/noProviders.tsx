import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import type { ProviderType } from 'api/providers';
import React from 'react';

import { NoProvidersState } from './noProvidersState';

interface NoProvidersOwnProps {
  providerType?: ProviderType;
  title?: string;
}

type NoProvidersProps = NoProvidersOwnProps;

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

export default NoProviders;
