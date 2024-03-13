import { ProgressStep, ProgressStepper, Text, TextContent, TextVariants } from '@patternfly/react-core';
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

import { CloudIntegration } from './cloudIntegration';
import { styles } from './dataDetails.styles';
import { getProgressIcon, getVariant, lookupKey } from './utils/status';

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

  // Filter OCP providers to skip an extra API request
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterInfo = ocpProviders?.data?.find(
    cluster => cluster.authentication?.credentials?.cluster_id === clusterId
  );

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  return (
    <>
      {clusterInfo?.infrastructure?.uuid && <CloudIntegration uuid={clusterInfo?.infrastructure?.uuid} />}
      <TextContent>
        <Text component={TextVariants.h3}>{intl.formatMessage(messages.metricsOperatorData)}</Text>
      </TextContent>
      <ProgressStepper aria-label={intl.formatMessage(messages.metricsOperatorData)} isVertical style={styles.stepper}>
        <ProgressStep
          aria-label={intl.formatMessage(messages.metricsOperatorDataReceivedAriaLabel, { count: 1 })}
          icon={getProgressIcon(clusterInfo.status.download)}
          id="step1"
          titleId="step1-title"
          variant={getVariant(clusterInfo.status.download)}
        >
          {intl.formatMessage(messages.metricsOperatorDataReceived, {
            value: lookupKey(clusterInfo.source_type),
          })}
          <div style={styles.description}>
            {intl.formatDate(clusterInfo.last_payload_received_at, {
              day: 'numeric',
              hour: 'numeric',
              hour12: false,
              minute: 'numeric',
              month: 'short',
              timeZone: 'UTC',
              timeZoneName: 'short',
              year: 'numeric',
            })}
          </div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.metricsOperatorDataProcessedAriaLabel, { count: 2 })}
          icon={getProgressIcon(clusterInfo.status.processing)}
          id="step2"
          titleId="step2-title"
          variant={getVariant(clusterInfo.status.processing)}
        >
          {intl.formatMessage(messages.metricsOperatorDataProcessed, {
            value: lookupKey(clusterInfo.source_type),
          })}
          <div style={styles.description}>
            {intl.formatDate(clusterInfo.last_payload_received_at, {
              day: 'numeric',
              hour: 'numeric',
              hour12: false,
              minute: 'numeric',
              month: 'short',
              timeZone: 'UTC',
              timeZoneName: 'short',
              year: 'numeric',
            })}
          </div>
        </ProgressStep>
      </ProgressStepper>
      <TextContent>
        <Text component={TextVariants.h3}>{intl.formatMessage(messages.calculations)}</Text>
      </TextContent>
      <ProgressStepper aria-label={intl.formatMessage(messages.calculations)} isVertical style={styles.stepper}>
        <ProgressStep
          aria-label={intl.formatMessage(messages.calculationsApplied)}
          icon={getProgressIcon(clusterInfo.status.summary)}
          id="step1"
          titleId="step1-title"
          variant={getVariant(clusterInfo.status.summary)}
        >
          {intl.formatMessage(messages.calculationsApplied)}
          <div style={styles.description}>
            {intl.formatDate(clusterInfo.last_payload_received_at, {
              day: 'numeric',
              hour: 'numeric',
              hour12: false,
              minute: 'numeric',
              month: 'short',
              timeZone: 'UTC',
              timeZoneName: 'short',
              year: 'numeric',
            })}
          </div>
        </ProgressStep>
      </ProgressStepper>
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): DataDetailsContentStateProps => {
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

export { DataDetailsContent };
