import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { styles } from './clusterDetails.styles';
import { ClusterDetailsTable } from './clusterDetailsTable';

interface ClusterDetailsOwnProps {
  // TBD...
}

interface ClusterDetailsStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type ClusterDetailsProps = ClusterDetailsOwnProps;

const ClusterDetails: React.FC<ClusterDetailsProps> = () => {
  const intl = useIntl();

  const { providers, providersError, providersFetchStatus } = useMapToProps();

  const title = intl.formatMessage(messages.ocpClusterDetails);

  if (providersError) {
    return <NotAvailable title={title} />;
  }

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  return <ClusterDetailsTable providers={providers} providerType={ProviderType.ocp} />;
};

const useMapToProps = (): ClusterDetailsStateProps => {
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

export { ClusterDetails };
