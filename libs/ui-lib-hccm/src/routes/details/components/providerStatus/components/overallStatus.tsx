import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import messages from '@koku-ui/i18n/locales/messages';
import type { AxiosError } from 'axios';
import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../../../store';
import type { FetchStatus } from '../../../../../store/common';
import { providersQuery, providersSelectors } from '../../../../../store/providers';
import { filterProviders } from '../../../../utils/providers';
import { formatDate } from '../utils/format';
import { getOverallStatusIcon } from '../utils/icon';
import { getProviderAvailability, getProviderStatus, StatusType } from '../utils/status';
import { styles } from './component.styles';

interface OverallStatusOwnProps {
  clusterId?: string;
  isLastUpdated?: boolean;
  isStatusMsg?: boolean;
  providerId?: string;
  providerType: ProviderType;
  uuId?: string;
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
  uuId,
}: OverallStatusProps) => {
  const { providers, providersError } = useMapToProps();
  const intl = useIntl();

  // Filter providers to skip an extra API request
  const getFilteredProviders = () => {
    return filterProviders(providers, providerType)?.data;
  };

  const getOverallStatus = (
    provider,
    cloudProvider
  ): { lastUpdated: string; msg: MessageDescriptor; status: StatusType } => {
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
      // A cluster may not have an integration, so cloudProvider could be undefined
      if (
        statusType === StatusType.complete &&
        (state1 === undefined || state1?.status === statusType) &&
        (state2 === undefined || state2?.status === statusType) &&
        (state3 === undefined || state3?.status === statusType) &&
        (state4 === undefined || state4?.status === statusType)
      ) {
        lastUpdated = state1?.lastUpdated;
        msg = state1?.msg;
        status = statusType;
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
    initializeState(StatusType.none, providerStatus, cloudStatus, providerAvailability, cloudAvailability); // Cannot show complete with an undefined status
    initializeState(StatusType.complete, providerStatus, cloudStatus, providerAvailability, cloudAvailability); // Must display the cluster status msg here

    return { lastUpdated, msg, status };
  };

  const getAllStatus = () => {
    let completeCount = 0;
    let failedCount = 0;
    let inProgressCount = 0;
    let noneCount = 0;
    let pausedCount = 0;
    let pendingCount = 0;

    const overallProviderStatus = [];
    const filteredProviders = getFilteredProviders();

    filteredProviders.map(provider => {
      const cloudProvider = providers?.data?.find(val => val.uuid === provider?.infrastructure?.uuid);
      overallProviderStatus.push(getOverallStatus(provider, cloudProvider));
    });

    overallProviderStatus.map(overallStatus => {
      if (overallStatus.status === StatusType.failed) {
        failedCount++;
      }
      if (overallStatus.status === StatusType.paused) {
        pausedCount++;
      }
      if (overallStatus.status === StatusType.inProgress) {
        inProgressCount++;
      }
      if (overallStatus.status === StatusType.pending) {
        pendingCount++;
      }
      if (overallStatus.status === StatusType.complete) {
        completeCount++;
      }
      if (overallStatus.status === StatusType.none) {
        noneCount++;
      }
    });
    return (
      <>
        {completeCount > 0 && (
          <>
            <span style={styles.count}>{completeCount}</span>
            <span style={styles.statusIcon}>{getOverallStatusIcon(StatusType.complete)}</span>
          </>
        )}
        {failedCount > 0 && (
          <>
            <span style={styles.count}>{failedCount}</span>
            <span style={styles.statusIcon}>{getOverallStatusIcon(StatusType.failed)}</span>
          </>
        )}
        {inProgressCount > 0 && (
          <>
            <span style={styles.count}>{inProgressCount}</span>
            <span style={styles.statusIcon}>{getOverallStatusIcon(StatusType.inProgress)}</span>
          </>
        )}
        {pausedCount > 0 && (
          <>
            <span style={styles.count}>{pausedCount}</span>
            <span style={styles.statusIcon}>{getOverallStatusIcon(StatusType.paused)}</span>
          </>
        )}
        {pendingCount > 0 && (
          <>
            <span style={styles.count}>{pendingCount}</span>
            <span style={styles.statusIcon}>{getOverallStatusIcon(StatusType.pending)}</span>
          </>
        )}
        {noneCount > 0 && (
          <>
            <span style={styles.count}>{noneCount}</span>
            <span style={styles.statusIcon}>{getOverallStatusIcon(StatusType.none)}</span>
          </>
        )}
      </>
    );
  };

  const getStatus = () => {
    const filteredProviders = getFilteredProviders();
    const provider = filteredProviders?.find(
      val =>
        providerId === val.id ||
        (clusterId && val.authentication?.credentials?.cluster_id === clusterId) ||
        uuId === val.uuid
    );
    const cloudProvider = providers?.data?.find(val => val.uuid === provider?.infrastructure?.uuid);
    const overallStatus = getOverallStatus(provider, cloudProvider);

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

  if (!providers || providersError) {
    return null;
  }
  if (providerId || clusterId || uuId) {
    return getStatus();
  } else {
    return getAllStatus();
  }
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
