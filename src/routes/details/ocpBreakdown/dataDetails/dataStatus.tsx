import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios/index';
import React from 'react';
import { useSelector } from 'react-redux';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import type { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { styles } from './dataDetails.styles';
import {
  getCloudAvailability,
  getCloudStatus,
  getClusterAvailability,
  getClusterStatus,
  getStatusIcon,
} from './utils/status';

interface DataStatusOwnProps {
  clusterId?: string;
}

interface DataStatusStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type DataStatusProps = DataStatusOwnProps;

const DataStatus: React.FC<DataStatusProps> = ({ clusterId }: DataStatusProps) => {
  const { providers, providersError } = useMapToProps();

  if (!providers || providersError) {
    return null;
  }

  // Filter OCP providers to skip an extra API request
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterInfo = ocpProviders?.data?.find(
    cluster => cluster.authentication?.credentials?.cluster_id === clusterId
  );

  const getOverallStatus = () => {
    let status;

    const cloudStatus = getCloudStatus(clusterInfo);
    const clusterStatus = getClusterStatus(clusterInfo);

    if (getCloudAvailability(clusterInfo) === 'failed' || getClusterAvailability(clusterInfo) === 'failed') {
      status = 'failed';
    } else if (cloudStatus === 'failed' || clusterStatus === 'failed') {
      status = 'failed';
    } else if (cloudStatus === 'in_progress' || clusterStatus === 'in_progress') {
      status = 'in_progress';
    } else if (cloudStatus === 'pending' || clusterStatus === 'pending') {
      status = 'pending';
    } else if (cloudStatus === 'complete' || clusterStatus === 'complete') {
      status = 'complete';
    }
    return status;
  };

  return <span style={styles.statusIcon}>{getStatusIcon(getOverallStatus())}</span>;
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): DataStatusStateProps => {
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

export { DataStatus };
