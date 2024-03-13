import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios/index';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';

import { styles } from './dataDetails.styles';
import { getIcon, lookupKey } from './utils/status';

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
  const intl = useIntl();
  const { providers, providersError } = useMapToProps();

  if (!providers || providersError) {
    return null;
  }

  // Filter OCP providers to skip an extra API request
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterInfo = ocpProviders?.data?.find(
    cluster => cluster.authentication?.credentials?.cluster_id === clusterId
  );

  return (
    <>
      <span style={styles.statusIcon}>{getIcon(clusterInfo?.status?.summary)}</span>
      {intl.formatMessage(messages.dataDetailsSummary, {
        value: lookupKey(clusterInfo?.status?.summary),
      })}
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): DataStatusStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  // PermissionsWraper has already made an API request
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

  useEffect(() => {
    if (!providersError && providersFetchStatus !== FetchStatus.inProgress) {
      dispatch(providersActions.fetchProviders(ProviderType.all, providersQueryString));
    }
  }, []);

  return {
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
};

export { DataStatus };
