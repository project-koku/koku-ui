import { RootState } from 'store/rootReducer';

import { currencyKey, getReportId, stateKey } from './currencyCommon';

export const selectCurrencyState = (state: RootState) => state[stateKey];

// Add provider

export const selectAddProviderFetchStatus = (state: RootState) =>
  selectCurrencyState(state).fetchStatus.get(currencyKey);

export const selectAddProviderError = (state: RootState) => selectCurrencyState(state).errors.get(currencyKey);

// Fetch currency

export const selectCurrency = (state: RootState, query: string = undefined) =>
  selectCurrencyState(state).byId.get(getReportId(query));

export const selectCurrencyFetchStatus = (state: RootState, query: string = undefined) =>
  selectCurrencyState(state).fetchStatus.get(getReportId(query));

export const selectCurrencyError = (state: RootState, query: string = undefined) =>
  selectCurrencyState(state).errors.get(getReportId(query));
