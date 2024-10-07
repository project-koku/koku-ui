import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { CloudData } from './components/cloudData';
import { ClusterData } from './components/clusterData';
import { Finalization } from './components/finalization';
import { styles } from './providerDetails.styles';

interface ProviderDetailsContentOwnProps {
  clusterId?: string;
  providerId?: string;
  providerType: ProviderType;
  uuId?: string;
}

interface ProviderDetailsContentStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type ProviderDetailsContentProps = ProviderDetailsContentOwnProps;

const ProviderDetailsContent: React.FC<ProviderDetailsContentProps> = ({
  clusterId,
  providerId,
  providerType,
  uuId,
}: ProviderDetailsContentProps) => {
  const intl = useIntl();

  const { providers, providersError, providersFetchStatus } = useMapToProps();

  const title = intl.formatMessage(messages.optimizations);

  if (providersError) {
    return <NotAvailable title={title} />;
  }

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  // Filter OCP providers to skip an extra API request
  const filteredProviders = filterProviders(providers, providerType)?.data?.filter(data => data.status !== null);
  const provider = filteredProviders?.find(
    val =>
      providerId === val.id ||
      (clusterId && val.authentication?.credentials?.cluster_id === clusterId) ||
      uuId === val.uuid
  );

  if (providerType === ProviderType.ocp) {
    const cloudProvider = providers?.data?.find(val => val.uuid === provider?.infrastructure?.uuid);
    return (
      <>
        <CloudData provider={cloudProvider} />
        <ClusterData provider={provider} />
        <Finalization provider={provider} providerType={providerType} />
      </>
    );
  }
  return (
    <>
      <CloudData provider={provider} />
      <Finalization provider={provider} providerType={providerType} />
    </>
  );
};

const useMapToProps = (): ProviderDetailsContentStateProps => {
  // PermissionsWrapper has already made an API request
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = useSelector((state: RootState) =>
    providersSelectors.selectProviders(state, ProviderType.all, providersQueryString)
  );
  const providersError = useSelector((state: RootState) =>
    providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString)
  );
  const providersFetchStatus = useSelector((state: RootState) =>
    providersSelectors.selectProvidersFetchStatus(state, ProviderType.all, providersQueryString)
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
};

export { ProviderDetailsContent };
