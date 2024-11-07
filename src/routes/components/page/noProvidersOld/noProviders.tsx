import { PageSection } from '@patternfly/react-core';
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
      <PageSection>
        <NoProvidersState providerType={providerType} />
      </PageSection>
    </>
  );
};

export default NoProviders;
