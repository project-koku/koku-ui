import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { AxiosError } from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../../store';
import { FetchStatus } from '../../../../store/common';
import { providersQuery, providersSelectors } from '../../../../store/providers';
import { NotAvailable } from '../../../components/page/notAvailable';
import { LoadingState } from '../../../components/state/loadingState';
import { filterProviders } from '../../../utils/providers';
import { styles } from './providerStatus.styles';
import { ProviderTable } from './providerTable';

interface ProviderStatusOwnProps {
  onClick?: (providerId: string) => void;
  providerType: ProviderType;
  showNotAvailable?: boolean;
}

interface ProviderStatusStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type ProviderStatusProps = ProviderStatusOwnProps;

const ProviderStatus: React.FC<ProviderStatusProps> = ({
  onClick,
  providerType,
  showNotAvailable,
}: ProviderStatusProps) => {
  const { providers, providersError, providersFetchStatus } = useMapToProps();

  // Omit NotAvailable when used in combination with the noData empty state
  if (providersError) {
    return showNotAvailable ? <NotAvailable /> : null;
  }

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  // Filter providers to skip an extra API request
  const filteredProviders = filterProviders(providers, providerType)?.data;
  if (filteredProviders.length === 0) {
    return;
  }

  return <ProviderTable onClick={onClick} providers={filteredProviders} providerType={providerType} />;
};

const useMapToProps = (): ProviderStatusStateProps => {
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

export { ProviderStatus };
