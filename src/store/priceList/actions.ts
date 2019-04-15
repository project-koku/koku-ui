import { fetchRate } from 'api/rates';
import { Rates } from 'api/rates';
import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import {
  createAction,
  createAsyncAction,
  createStandardAction,
} from 'typesafe-actions';

export const openModal = createStandardAction('dialog/price_list/open')<
  string
>();

export const closeModal = createAction('dialog/price_list/close');

export const {
  request: fetchPriceListRequest,
  success: fetchPriceListSuccess,
  failure: fetchPriceListFailure,
} = createAsyncAction(
  'priceList/fetch/request',
  'priceList/fetch/success',
  'priceList/fetch/failure'
)<void, Rates, AxiosError>();

export function fetchPriceList() {
  return (dispatch: Dispatch, getState) => {
    dispatch(fetchPriceListRequest());
    return fetchRate()
      .then(res => {
        dispatch(fetchPriceListSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchPriceListFailure(err));
      });
  };
}
