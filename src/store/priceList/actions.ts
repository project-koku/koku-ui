import { fetchRate } from 'api/rates';
import { Rates } from 'api/rates';
import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { expirationMS, FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';

import { cachedRates, status } from './selectors';

interface Meta {
  providerUuid: string;
}

export const fetchPriceListRequest = createStandardAction('priceList/request')<Meta>();

export const fetchPriceListSuccess = createStandardAction('priceList/success')<Rates, Meta>();

export const fetchPriceListFailure = createStandardAction('priceList/failure')<AxiosError, Meta>();

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
