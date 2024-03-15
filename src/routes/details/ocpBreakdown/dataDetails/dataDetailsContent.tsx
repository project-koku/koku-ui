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
import { getClusterAvailability, getProgressStepIcon, getStatus, lookupKey } from './utils/status';

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

  const getOperator = () => {
    return (
      <>
        <TextContent>
          <Text component={TextVariants.h3}>{intl.formatMessage(messages.dataDetailsMetricsOperator)}</Text>
        </TextContent>
        <ProgressStepper
          aria-label={intl.formatMessage(messages.dataDetailsMetricsOperator)}
          isVertical
          style={styles.stepper}
        >
          <ProgressStep
            aria-label={intl.formatMessage(messages.sourceAvailable)}
            id="step1"
            titleId="step1-title"
            variant={getStatus(getClusterAvailability(clusterInfo))}
          >
            {intl.formatMessage(messages.sourceAvailable, {
              value: lookupKey(clusterInfo.source_type),
            })}
          </ProgressStep>
          <ProgressStep
            aria-label={intl.formatMessage(messages.dataDetailsTransferredAriaLabel)}
            icon={getProgressStepIcon(clusterInfo.status.download.state)}
            id="step1"
            titleId="step1-title"
            variant={getStatus(clusterInfo.status.download.state)}
          >
            {intl.formatMessage(messages.dataDetailsTransferred, {
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
            aria-label={intl.formatMessage(messages.dataDetailsProcessedAriaLabel)}
            icon={getProgressStepIcon(clusterInfo.status.processing.state)}
            id="step2"
            titleId="step2-title"
            variant={getStatus(clusterInfo.status.processing.state)}
          >
            {intl.formatMessage(messages.dataDetailsProcessed, {
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
          <Text component={TextVariants.h3}>{intl.formatMessage(messages.dataDetailsFinalized)}</Text>
        </TextContent>
        <ProgressStepper
          aria-label={intl.formatMessage(messages.dataDetailsFinalized)}
          isVertical
          style={styles.stepper}
        >
          <ProgressStep
            aria-label={intl.formatMessage(messages.dataDetailsCalculated)}
            icon={getProgressStepIcon(clusterInfo.status.summary.state)}
            id="step1"
            titleId="step1-title"
            variant={getStatus(clusterInfo.status.summary.state)}
          >
            {intl.formatMessage(messages.dataDetailsCalculated)}
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

  return (
    <>
      {clusterInfo?.infrastructure?.uuid && <CloudIntegration uuid={clusterInfo?.infrastructure?.uuid} />}
      {getOperator()}
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): DataDetailsContentStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

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
