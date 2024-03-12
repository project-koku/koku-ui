import './clusterContent.scss';

import { Icon, Text, TextContent, TextList, TextListItem, TextVariants } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
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
import { routes } from 'routes';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';
import { formatPath, getReleasePath } from 'utils/paths';

import { CloudIntegration } from './cloudIntegration';
import { styles } from './clusterInfo.styles';

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

const ClusterContent: React.FC<ClusterInfoContentProps> = ({ clusterId }: ClusterInfoContentProps) => {
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

  const release = getReleasePath();

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }
  return (
    <TextContent className="textContentOverride">
      <Text component={TextVariants.h3}>{intl.formatMessage(messages.clusterId)}</Text>
      <TextList isPlain>
        <TextListItem>
          <span style={styles.spacingRight}>{clusterId}</span>
          <a href={`${release}/openshift/details/${clusterId}`}>{intl.formatMessage(messages.ocpClusterDetails)}</a>
        </TextListItem>
        {clusterInfo?.cost_models?.length === 0 && (
          <TextListItem>
            <a href={formatPath(routes.settings.path)}>{intl.formatMessage(messages.assignCostModel)}</a>
          </TextListItem>
        )}
      </TextList>
      <Text component={TextVariants.h3}>{intl.formatMessage(messages.costManagementOperatorVersion)}</Text>
      <TextList isPlain>
        <TextListItem>
          <span style={styles.spacingRight}>{clusterInfo?.additional_context?.operator_version}</span>
          {clusterInfo?.additional_context?.operator_update_available && (
            <>
              <Icon status="warning">
                <ExclamationTriangleIcon />
              </Icon>
              <span style={styles.updateAvailable}>{intl.formatMessage(messages.updateAvailable)}</span>
            </>
          )}
        </TextListItem>
      </TextList>
      {clusterInfo && (
        <>
          <Text component={TextVariants.h3}>{intl.formatMessage(messages.redHatIntegration)}</Text>
          <TextList isPlain>
            <TextListItem>
              <span style={styles.spacingRight}>{intl.formatMessage(messages.source, { value: 'ocp' })}</span>
              <a href={`${release}/settings/integrations/detail/${clusterInfo.id}`}>{clusterInfo.name}</a>
            </TextListItem>
          </TextList>
          {clusterInfo?.infrastructure?.uuid && <CloudIntegration uuid={clusterInfo?.infrastructure?.uuid} />}
        </>
      )}
    </TextContent>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): ClusterInfoContentStateProps => {
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

export { ClusterContent };
