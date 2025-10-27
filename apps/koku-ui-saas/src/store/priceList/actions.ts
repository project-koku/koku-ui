import type { Rates } from 'api/rates';
import { fetchRate } from 'api/rates';
import type { AxiosError } from 'axios';
import type { Dispatch } from 'redux';
import { expirationMS, FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { cachedRates, status } from './selectors';

interface Meta {
  providerUuid: string;
}

export const fetchPriceListRequest = createAction('priceList/request')<Meta>();

export const fetchPriceListSuccess = createAction('priceList/success')<Rates, Meta>();

export const fetchPriceListFailure = createAction('priceList/failure')<AxiosError, Meta>();

export function fetchPriceList(providerUuid) {
  const meta = { providerUuid };
  return (dispatch: Dispatch, getState) => {
    if (!isExpired(getState(), meta)) {
      return;
    }
    dispatch(fetchPriceListRequest(meta));
    return fetchRate(providerUuid)
      .then(res => {
        dispatch(fetchPriceListSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchPriceListFailure(err, meta));
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
