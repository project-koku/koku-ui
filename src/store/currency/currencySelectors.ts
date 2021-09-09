import { RootState } from 'store/rootReducer';

import { getReportId, stateKey } from './currencyCommon';

export const selectCurrencyState = (state: RootState) => state[stateKey];

// Fetch currency

export const selectCurrency = (state: RootState, query: string = undefined) =>
  selectCurrencyState(state).byId.get(getReportId(query));

export const selectCurrencyFetchStatus = (state: RootState, query: string = undefined) =>
  selectCurrencyState(state).fetchStatus.get(getReportId(query));

export const selectCurrencyError = (state: RootState, query: string = undefined) =>
  selectCurrencyState(state).errors.get(getReportId(query));
