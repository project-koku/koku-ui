import { Text, TextContent, TextList, TextListItem, TextVariants } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';

import { styles } from './modal.styles';

interface ClusterInfoContentOwnProps {
  clusterId?: string;
}

export interface ClusterInfoContentStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

export interface ClusterInfoContentMapProps {
  // TBD...
}

type ClusterInfoContentProps = ClusterInfoContentOwnProps;

const ClusterInfoContent: React.FC<ClusterInfoContentProps> = ({ clusterId }: ClusterInfoContentProps) => {
  const intl = useIntl();

  const { providers, providersError, providersFetchStatus } = useMapToProps();

  const title = intl.formatMessage(messages.optimizations);

  if (providersError) {
    return <NotAvailable title={title} />;
  }

  // Filter OCP providers to skip an extra API request
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterInfo = ocpProviders?.data?.find(
    cluster => cluster.authentication?.credentials?.cluster_id === clusterId
  );

  return (
    <div style={styles.container}>
      {providersFetchStatus === FetchStatus.inProgress ? (
        <div style={styles.loading}>
          <LoadingState />
        </div>
      ) : (
        <TextContent className="textContentOverride">
          <Text component={TextVariants.h3}>{intl.formatMessage(messages.clusterId)}</Text>
          <TextList isPlain>
            <TextListItem>{clusterId}</TextListItem>
          </TextList>
          <Text component={TextVariants.h3}>{intl.formatMessage(messages.redHatIntegration)}</Text>
          <TextList isPlain>
            <TextListItem>{clusterInfo ? clusterInfo.uuid : null}</TextListItem>
          </TextList>
        </TextContent>
      )}
    </div>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): ClusterInfoContentStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  // PermissionsWraper has already made an API request using ProviderType.all
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

export { ClusterInfoContent };
