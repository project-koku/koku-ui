import type { Currency, CurrencyType } from 'api/currency';
import { fetchCurrency as apiFetchCurrency } from 'api/currency';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './currencyCommon';
import { selectCurrencyError, selectCurrencyFetchStatus } from './currencySelectors';

interface CurrencyActionMeta {
  fetchId: string;
  notification?: any;
}

export const fetchCurrencyRequest = createAction('currency/fetch/request')<CurrencyActionMeta>();
export const fetchCurrencySuccess = createAction('currency/fetch/success')<Currency, CurrencyActionMeta>();
export const fetchCurrencyFailure = createAction('currency/fetch/failure')<AxiosError, CurrencyActionMeta>();

export const resetStatus = createAction('currency/status/reset')<{ fetchId: string }>();

export function fetchCurrency(currencyType: CurrencyType, reportQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectCurrencyError(state, currencyType, reportQueryString);
    const fetchStatus = selectCurrencyFetchStatus(state, currencyType, reportQueryString);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: CurrencyActionMeta = {
      fetchId: getFetchId(currencyType, reportQueryString),
    };

    dispatch(fetchCurrencyRequest(meta));

    return apiFetchCurrency(currencyType, reportQueryString)
      .then(res => {
        dispatch(fetchCurrencySuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchCurrencyFailure(err, meta));
      });
  };
}
