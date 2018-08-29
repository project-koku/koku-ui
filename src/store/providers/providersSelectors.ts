import { RootState } from '../rootReducer';
import { stateKey } from './providersReducer';

export const selectProvidersState = (state: RootState) => state[stateKey];

// Add provider

export const selectAddProviderFetchStatus = (state: RootState) =>
  selectProvidersState(state).providersFetchStatus;

export const selectAddProviderError = (state: RootState) =>
  selectProvidersState(state).providersError;

// Get providers

export const selectProviders = (state: RootState) =>
  selectProvidersState(state).providers;

export const selectProvidersFetchStatus = (state: RootState) =>
  selectProvidersState(state).providersFetchStatus;

export const selectProvidersError = (state: RootState) =>
  selectProvidersState(state).providersError;
