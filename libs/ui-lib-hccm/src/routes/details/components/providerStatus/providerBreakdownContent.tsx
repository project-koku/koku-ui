import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { AxiosError } from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../../store';
import { FetchStatus } from '../../../../store/common';
import { providersQuery, providersSelectors } from '../../../../store/providers';
import { NotAvailable } from '../../../components/page/notAvailable';
import { LoadingState } from '../../../components/state/loadingState';
import { filterProviders } from '../../../utils/providers';
import { CloudData } from './components/cloudData';
import { ClusterData } from './components/clusterData';
import { Finalization } from './components/finalization';
import { styles } from './providerStatus.styles';

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

const ProviderBreakdownContent: React.FC<ProviderDetailsContentProps> = ({
  clusterId,
  providerId,
  providerType,
  uuId,
}: ProviderDetailsContentProps) => {
  const { providers, providersError, providersFetchStatus } = useMapToProps();

  if (providersError) {
    return <NotAvailable />;
  }

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  // Filter OCP providers to skip an extra API request
  const filteredProviders = filterProviders(providers, providerType)?.data;
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

export { ProviderBreakdownContent };
