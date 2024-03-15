import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios/index';
import React from 'react';
import { useSelector } from 'react-redux';
import { styles } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/dataDetails.styles';
import { getOverallStatusIcon } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/utils/icon';
import {
  getProviderAvailability,
  getProviderStatus,
  StatusType,
} from 'routes/details/ocpBreakdown/providerDetails/dataDetails/utils/status';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import type { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

interface OverallStatusOwnProps {
  clusterId?: string;
}

interface OverallStatusStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type OverallStatusProps = OverallStatusOwnProps;

const OverallStatus: React.FC<OverallStatusProps> = ({ clusterId }: OverallStatusProps) => {
  const { providers, providersError } = useMapToProps();

  if (!providers || providersError) {
    return null;
  }

  // Filter OCP providers to skip an extra API request
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterProvider = ocpProviders?.data?.find(val => val.authentication?.credentials?.cluster_id === clusterId);
  const cloudProvider = providers?.data?.find(val => val.uuid === clusterProvider?.infrastructure?.uuid);

  const getOverallStatus = () => {
    let status;

    const cloudAvailability = getProviderAvailability(cloudProvider);
    const clusterAvailability = getProviderAvailability(clusterProvider);
    const cloudStatus = getProviderStatus(cloudProvider);
    const clusterStatus = getProviderStatus(clusterProvider);

    if (cloudAvailability === StatusType.failed || clusterAvailability === StatusType.failed) {
      status = StatusType.failed;
    } else if (cloudStatus === StatusType.failed || clusterStatus === StatusType.failed) {
      status = 'failed';
    } else if (cloudAvailability === StatusType.paused || clusterAvailability === StatusType.paused) {
      status = 'paused';
    } else if (cloudStatus === StatusType.inProgress || clusterStatus === StatusType.inProgress) {
      status = 'in_progress';
    } else if (cloudStatus === StatusType.pending || clusterStatus === StatusType.pending) {
      status = 'pending';
    } else if (
      cloudStatus === StatusType.complete &&
      clusterStatus === StatusType.complete &&
      cloudAvailability === StatusType.complete &&
      clusterAvailability === StatusType.complete
    ) {
      status = 'complete';
    }
    return status;
  };

  return <span style={styles.statusIcon}>{getOverallStatusIcon(getOverallStatus())}</span>;
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): OverallStatusStateProps => {
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

export { OverallStatus };
