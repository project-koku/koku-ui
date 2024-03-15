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
import { CloudIData } from 'routes/details/ocpBreakdown/dataDetails/components/cloudIData';
import { ClusterData } from 'routes/details/ocpBreakdown/dataDetails/components/clusterData';
import { CostData } from 'routes/details/ocpBreakdown/dataDetails/components/costData';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { styles } from './dataDetails.styles';

interface DataDetailsContentOwnProps {
  clusterId?: string;
}

interface DataDetailsContentStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type DataDetailsContentProps = DataDetailsContentOwnProps;

const DataDetailsContent: React.FC<DataDetailsContentProps> = ({ clusterId }: DataDetailsContentProps) => {
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
      {cloudProvider && <CloudIData provider={cloudProvider} />}
      {clusterProvider && <ClusterData provider={clusterProvider} />}
      {clusterProvider && <CostData provider={clusterProvider} />}
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): DataDetailsContentStateProps => {
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

export { DataDetailsContent };
