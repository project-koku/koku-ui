import { Text, TextList, TextListItem, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import { ProviderType } from 'api/providers';
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
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';
import { formatPath, getReleasePath } from 'utils/paths';

import { styles } from './clusterInfo.styles';

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

  const release = getReleasePath();

  if (providerFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }
  return (
    <>
      <Text component={TextVariants.h3}>{intl.formatMessage(messages.cloudIntegration)}</Text>
      <TextList isPlain>
        <TextListItem>
          <span style={styles.spacingRight}>
            {intl.formatMessage(messages.source, { value: provider?.source_type?.toLowerCase() })}
          </span>
          <a href={`${release}/settings/integrations/detail/${provider?.id}`}>{provider?.name}</a>
        </TextListItem>
        {provider?.cost_models?.length === 0 && (
          <TextListItem>
            <a href={formatPath(routes.settings.path)}>{intl.formatMessage(messages.assignCostModel)}</a>
          </TextListItem>
        )}
      </TextList>
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
