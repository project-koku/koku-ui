import { Rates } from 'api/rates';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchPriceListFailure,
  fetchPriceListRequest,
  fetchPriceListSuccess,
} from './actions';

export const stateKey = 'priceList';

export type State = Readonly<{
  rates: Rates;
  error: AxiosError;
  status: FetchStatus;
}>;

export const defaultState: State = {
  rates: null,
  error: null,
  status: FetchStatus.none,
};

export type Action = ActionType<
  | typeof fetchPriceListRequest
  | typeof fetchPriceListSuccess
  | typeof fetchPriceListFailure
>;

export function reducer(state = defaultState, action: Action): State {
  switch (action.type) {
    case getType(fetchPriceListRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(fetchPriceListSuccess):
      return {
        ...state,
        rates: action.payload,
        error: null,
        status: FetchStatus.complete,
      };
    case getType(fetchPriceListFailure):
      return {
        ...state,
        error: action.payload,
        status: FetchStatus.complete,
      };
    default:
      return state;
  }
}
