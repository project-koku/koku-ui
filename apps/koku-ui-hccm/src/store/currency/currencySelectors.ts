import type { CurrencyType } from 'api/currency';
import type { RootState } from 'store/rootReducer';

import { getFetchId } from './currencyCommon';
import { currencyStateKey } from './currencyCommon';

export const selectCurrencyState = (state: RootState) => state[currencyStateKey];

export const selectCurrency = (state: RootState, settingsType: CurrencyType, reportQueryString: string) =>
  selectCurrencyState(state).byId.get(getFetchId(settingsType, reportQueryString));

export const selectCurrencyError = (state: RootState, settingsType: CurrencyType, reportQueryString: string) =>
  selectCurrencyState(state)?.errors.get(getFetchId(settingsType, reportQueryString));

export const selectCurrencyFetchStatus = (state: RootState, settingsType: CurrencyType, reportQueryString: string) =>
  selectCurrencyState(state)?.status.get(getFetchId(settingsType, reportQueryString));
