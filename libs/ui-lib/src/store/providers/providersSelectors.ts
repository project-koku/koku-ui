import type { ProviderType } from '@koku-ui/api/providers';

import type { RootState } from '../rootReducer';
import { addProviderKey, getFetchId, stateKey } from './providersCommon';

export const selectProvidersState = (state: RootState) => state[stateKey];

// Add provider

export const selectAddProviderFetchStatus = (state: RootState) =>
  selectProvidersState(state).fetchStatus.get(addProviderKey);

export const selectAddProviderError = (state: RootState) => selectProvidersState(state).errors.get(addProviderKey);

// Fetch providers

export const selectProviders = (state: RootState, providerType: ProviderType, provideQueryString: string) =>
  selectProvidersState(state).byId.get(getFetchId(providerType, provideQueryString));

export const selectProvidersFetchStatus = (state: RootState, providerType: ProviderType, provideQueryString: string) =>
  selectProvidersState(state).fetchStatus.get(getFetchId(providerType, provideQueryString));

export const selectProvidersError = (state: RootState, providerType: ProviderType, provideQueryString: string) =>
  selectProvidersState(state).errors.get(getFetchId(providerType, provideQueryString));
