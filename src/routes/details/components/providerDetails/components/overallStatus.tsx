import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios/index';
import messages from 'locales/messages';
import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { formatDate } from 'routes/details/components/providerDetails/utils/format';
import { getOverallStatusIcon } from 'routes/details/components/providerDetails/utils/icon';
import {
  getProviderAvailability,
  getProviderStatus,
  StatusType,
} from 'routes/details/components/providerDetails/utils/status';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import type { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { styles } from './component.styles';

interface OverallStatusOwnProps {
  clusterId?: string;
  isLastUpdated?: boolean;
  isStatusMsg?: boolean;
  providerId?: string;
  providerType: ProviderType;
}

interface OverallStatusStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type OverallStatusProps = OverallStatusOwnProps;

const OverallStatus: React.FC<OverallStatusProps> = ({
  clusterId,
  isLastUpdated,
  isStatusMsg,
  providerId,
  providerType,
}: OverallStatusProps) => {
  const { providers, providersError } = useMapToProps();
  const intl = useIntl();

  if (!providers || providersError) {
    return null;
  }

  // Filter OCP providers to skip an extra API request
  const filteredProviders = filterProviders(providers, providerType)?.data?.filter(data => data.status !== null);
  const provider = filteredProviders?.find(
    val => providerId === val.id || (clusterId && val.authentication?.credentials?.cluster_id === clusterId)
  );
  const cloudProvider = providers?.data?.find(val => val.uuid === provider?.infrastructure?.uuid);

  const getOverallStatus = (): { lastUpdated: string; msg: MessageDescriptor; status: StatusType } => {
    let lastUpdated;
    let msg;
    let status;

    const cloudAvailability = getProviderAvailability(cloudProvider);
    const providerAvailability = getProviderAvailability(provider);
    const cloudStatus = getProviderStatus(cloudProvider, true);
    const providerStatus = getProviderStatus(provider);

    const initializeState = (statusType: StatusType, state1, state2, state3, state4) => {
      if (msg && status) {
        return;
      }
      if (statusType === StatusType.complete) {
        // A cluster may not have an integration, so cloudProvider could be undefined
        if (
          (state1 === undefined || state1?.status === statusType) &&
          (state2 === undefined || state2?.status === statusType) &&
          (state3 === undefined || state3?.status === statusType) &&
          (state4 === undefined || state4?.status === statusType)
        ) {
          lastUpdated = state1?.lastUpdated;
          msg = state1?.msg;
          status = statusType;
        }
      } else {
        if (state1?.status === statusType) {
          lastUpdated = state1?.lastUpdated;
          msg = state1?.msg;
          status = statusType;
        } else if (state2?.status === statusType) {
          lastUpdated = state2?.lastUpdated;
          msg = state2?.msg;
          status = statusType;
        } else if (state3?.status === statusType) {
          lastUpdated = state3?.lastUpdated;
          msg = state3?.msg;
          status = statusType;
        } else if (state4?.status === statusType) {
          lastUpdated = state4?.lastUpdated;
          msg = state4?.msg;
          status = statusType;
        }
      }
    };

    // Note: status is not synchronous; however, status shall be applied in order provided below (e.g., failed takes precedence over any other state).
    // Cloud availability takes precedence over cloud status, while cluster availability takes precedence over cluster status, and so on...
    initializeState(StatusType.failed, cloudAvailability, providerAvailability, cloudStatus, providerStatus);
    initializeState(StatusType.paused, cloudAvailability, providerAvailability, cloudStatus, providerStatus);
    initializeState(StatusType.inProgress, cloudAvailability, providerAvailability, cloudStatus, providerStatus); // Availability won't likely have in-progress and pending states
    initializeState(StatusType.pending, cloudAvailability, providerAvailability, cloudStatus, providerStatus);
    initializeState(StatusType.complete, providerStatus, cloudStatus, providerAvailability, cloudAvailability); // Must display the cluster status msg here

    return { lastUpdated, msg, status };
  };

  const overallStatus = getOverallStatus();

  if (isLastUpdated) {
    return overallStatus.lastUpdated ? formatDate(overallStatus.lastUpdated) : null;
  }
  if (overallStatus.msg && overallStatus.status) {
    return (
      <>
        <span style={styles.statusIcon}>{getOverallStatusIcon(overallStatus.status)}</span>
        <span style={styles.description}>
          {isStatusMsg
            ? intl.formatMessage(messages.statusMsg, { value: overallStatus.status })
            : intl.formatMessage(overallStatus.msg)}
        </span>
      </>
    );
  }
  return null;
};

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
