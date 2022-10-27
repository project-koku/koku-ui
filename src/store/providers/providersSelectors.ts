import type { ProviderType } from 'api/providers';
import type { RootState } from 'store/rootReducer';

import { addProviderKey, getReportId, stateKey } from './providersCommon';

export const selectProvidersState = (state: RootState) => state[stateKey];

// Add provider

export const selectAddProviderFetchStatus = (state: RootState) =>
  selectProvidersState(state).fetchStatus.get(addProviderKey);

export const selectAddProviderError = (state: RootState) => selectProvidersState(state).errors.get(addProviderKey);

// Fetch providers

export const selectProviders = (state: RootState, providerType: ProviderType, query: string) =>
  selectProvidersState(state).byId.get(getReportId(providerType, query));

export const selectProvidersFetchStatus = (state: RootState, providerType: ProviderType, query: string) =>
  selectProvidersState(state).fetchStatus.get(getReportId(providerType, query));

export const selectProvidersError = (state: RootState, providerType: ProviderType, query: string) =>
  selectProvidersState(state).errors.get(getReportId(providerType, query));
