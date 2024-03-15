import { ProgressStep, ProgressStepper, Text, TextContent, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';

import { styles } from './dataDetails.styles';
import { getCloudAvailability, getProgressStepIcon, getStatus, lookupKey } from './utils/status';

interface CloudIntegrationOwnProps {
  uuid?: string;
}

interface CloudIntegrationStateProps {
  provider: Provider;
  providerError: AxiosError;
  providerFetchStatus: FetchStatus;
  providerQueryString: string;
  uuid?: string;
}

type CloudIntegrationProps = CloudIntegrationOwnProps;

const CloudIntegration: React.FC<CloudIntegrationProps> = ({ uuid }: CloudIntegrationProps) => {
  const intl = useIntl();

  const { provider, providerError, providerFetchStatus } = useMapToProps({ uuid });

  const title = intl.formatMessage(messages.optimizations);

  if (providerError) {
    return <NotAvailable title={title} />;
  }

  if (providerFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h3}>{intl.formatMessage(messages.dataDetailsCloudIntegration)}</Text>
      </TextContent>
      <ProgressStepper
        aria-label={intl.formatMessage(messages.dataDetailsCloudIntegration)}
        isVertical
        style={styles.stepper}
      >
        <ProgressStep
          aria-label={intl.formatMessage(messages.sourceAvailable)}
          id="step1"
          titleId="step1-title"
          variant={getStatus(getCloudAvailability(provider))}
        >
          {intl.formatMessage(messages.sourceAvailable, {
            value: lookupKey(provider.source_type),
          })}
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataCheckedAriaLabel)}
          id="step1"
          titleId="step1-title"
          variant="success"
        >
          {intl.formatMessage(messages.dataChecked, {
            value: lookupKey(provider.source_type),
          })}
          <div style={styles.description}>
            {intl.formatDate(provider.last_payload_received_at, {
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
          aria-label={intl.formatMessage(messages.dataDetailsTransferredAriaLabel)}
          icon={getProgressStepIcon(provider.status.download.state)}
          id="step2"
          titleId="step2-title"
          variant={getStatus(provider.status.download.state)}
        >
          {intl.formatMessage(messages.dataDetailsTransferred, {
            value: lookupKey(provider.source_type),
          })}
          <div style={styles.description}>
            {intl.formatDate(provider.last_payload_received_at, {
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
          aria-label={intl.formatMessage(messages.dataDetailsProcessedAriaLabel, { count: 3 })}
          icon={getProgressStepIcon(provider.status.processing.state)}
          id="step3"
          titleId="step3-title"
          variant={getStatus(provider.status.processing.state)}
        >
          {intl.formatMessage(messages.dataDetailsProcessed, {
            value: lookupKey(provider.source_type),
          })}
          <div style={styles.description}>
            {intl.formatDate(provider.last_payload_received_at, {
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
const useMapToProps = ({ uuid }): CloudIntegrationStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const providerQueryString = uuid;
  const provider = useSelector(
    (state: RootState) => providersSelectors.selectProviders(state, ProviderType.uuid, providerQueryString) as Provider
  );
  const providerError = useSelector((state: RootState) =>
    providersSelectors.selectProvidersError(state, ProviderType.uuid, providerQueryString)
  );
  const providerFetchStatus = useSelector((state: RootState) =>
    providersSelectors.selectProvidersFetchStatus(state, ProviderType.uuid, providerQueryString)
  );

  useEffect(() => {
    if (!providerError && providerFetchStatus !== FetchStatus.inProgress) {
      dispatch(providersActions.fetchProviders(ProviderType.uuid, providerQueryString));
    }
  }, []);

  return {
    provider,
    providerError,
    providerFetchStatus,
    providerQueryString,
  };
};

export { CloudIntegration };
