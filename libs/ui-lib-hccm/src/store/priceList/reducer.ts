import type { Rates } from '@koku-ui/api/rates';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchPriceListFailure, fetchPriceListRequest, fetchPriceListSuccess } from './actions';

export const stateKey = 'priceList';

export interface CachedRates extends Rates {
  timeRequested: number;
}

export type State = Readonly<{
  rates: Map<string, CachedRates>;
  error: Map<string, AxiosError>;
  status: Map<string, FetchStatus>;
}>;

export const defaultState: State = {
  rates: new Map(),
  error: new Map(),
  status: new Map(),
};

export type Action = ActionType<
  typeof fetchPriceListRequest | typeof fetchPriceListSuccess | typeof fetchPriceListFailure | typeof resetState
>;

export function reducer(state = defaultState, action: Action): State {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchPriceListRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.providerUuid, FetchStatus.inProgress),
      };
    case getType(fetchPriceListSuccess):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.providerUuid, FetchStatus.complete),
        rates: new Map(state.rates).set(action.meta.providerUuid, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        error: new Map(state.error).set(action.meta.providerUuid, null),
      };
    case getType(fetchPriceListFailure):
      return {
        ...state,
        error: new Map(state.error).set(action.meta.providerUuid, action.payload),
        status: new Map(state.status).set(action.meta.providerUuid, FetchStatus.complete),
      };
    default:
      return state;
  }
}
