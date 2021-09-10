import { RootState } from 'store/rootReducer';

import { getReportId, stateKey } from './currencyCommon';

export const selectCurrencyState = (state: RootState) => state[stateKey];

// Fetch currency

export const selectCurrency = (state: RootState) => selectCurrencyState(state).byId.get(getReportId());

export const selectCurrencyFetchStatus = (state: RootState) =>
  selectCurrencyState(state).fetchStatus.get(getReportId());

export const selectCurrencyError = (state: RootState) => selectCurrencyState(state).errors.get(getReportId());
