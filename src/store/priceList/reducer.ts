import { Rates } from 'api/rates';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  closeModal,
  fetchPriceListFailure,
  fetchPriceListRequest,
  fetchPriceListSuccess,
  openModal,
} from './actions';

export const stateKey = 'priceList';

export type State = Readonly<{
  rates: Rates;
  error: AxiosError;
  status: FetchStatus;
  modal: {
    isOpen: boolean;
    name: string;
  };
}>;

export const defaultState: State = {
  rates: null,
  error: null,
  status: FetchStatus.none,
  modal: {
    isOpen: false,
    name: null,
  },
};

export type Action = ActionType<
  | typeof fetchPriceListRequest
  | typeof fetchPriceListSuccess
  | typeof fetchPriceListFailure
  | typeof closeModal
  | typeof openModal
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
    case getType(closeModal):
      return {
        ...state,
        modal: {
          isOpen: false,
          name: null,
        },
      };
    case getType(openModal):
      return {
        ...state,
        modal: {
          isOpen: true,
          name: action.payload,
        },
      };
    default:
      return state;
  }
}
