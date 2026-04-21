import type { Rates } from 'api/rates';
import { fetchRate as apiFetchRates } from 'api/rates';
import type { AxiosError } from 'axios';
import type { Dispatch } from 'redux';
import { expirationMS, FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { cachedRates, status } from './selectors';

interface Meta {
  providerUuid: string;
}

export const fetchRateRequest = createAction('priceList/request')<Meta>();

export const fetchRateSuccess = createAction('priceList/success')<Rates, Meta>();

export const fetchRateFailure = createAction('priceList/failure')<AxiosError, Meta>();

export function fetchRate(providerUuid) {
  const meta = { providerUuid };
  return (dispatch: Dispatch, getState) => {
    if (!isExpired(getState(), meta)) {
      return;
    }
    dispatch(fetchRateRequest(meta));
    return apiFetchRates(providerUuid)
      .then(res => {
        dispatch(fetchRateSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchRateFailure(err, meta));
      });
  };
}

function isExpired(state: RootState, meta: Meta) {
  const cachedData = cachedRates(state, meta.providerUuid);
  const reqStatus = status(state, meta.providerUuid);
  if (reqStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!cachedData) {
    return true;
  }

  const now = Date.now();
  return now > cachedData.timeRequested + expirationMS;
}
