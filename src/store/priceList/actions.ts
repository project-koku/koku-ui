import { fetchRate } from 'api/rates';
import { Rates } from 'api/rates';
import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchPriceListRequest,
  success: fetchPriceListSuccess,
  failure: fetchPriceListFailure,
} = createAsyncAction(
  'priceList/fetch/request',
  'priceList/fetch/success',
  'priceList/fetch/failure'
)<void, Rates, AxiosError>();

export function fetchPriceList(providerUuid) {
  return (dispatch: Dispatch, getState) => {
    dispatch(fetchPriceListRequest());
    return fetchRate(providerUuid)
      .then(res => {
        dispatch(fetchPriceListSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchPriceListFailure(err));
      });
  };
}
