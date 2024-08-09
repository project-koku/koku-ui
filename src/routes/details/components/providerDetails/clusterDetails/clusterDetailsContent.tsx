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
import { CloudData } from 'routes/details/components/providerDetails/clusterDetails/components/cloudData';
import { ClusterData } from 'routes/details/components/providerDetails/clusterDetails/components/clusterData';
import { CostData } from 'routes/details/components/providerDetails/clusterDetails/components/costData';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { styles } from './clusterDetails.styles';

interface ClusterDetailsContentOwnProps {
  clusterId?: string;
}

interface ClusterDetailsContentStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type ClusterDetailsContentProps = ClusterDetailsContentOwnProps;

const ClusterDetailsContent: React.FC<ClusterDetailsContentProps> = ({ clusterId }: ClusterDetailsContentProps) => {
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
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterProvider = ocpProviders?.data?.find(val => val.authentication?.credentials?.cluster_id === clusterId);
  const cloudProvider = providers?.data?.find(val => val.uuid === clusterProvider?.infrastructure?.uuid);

  return (
    <>
      {cloudProvider && <CloudData provider={cloudProvider} />}
      {clusterProvider && <ClusterData provider={clusterProvider} />}
      {clusterProvider && <CostData provider={clusterProvider} />}
    </>
  );
};

const useMapToProps = (): ClusterDetailsContentStateProps => {
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

export { ClusterDetailsContent };
