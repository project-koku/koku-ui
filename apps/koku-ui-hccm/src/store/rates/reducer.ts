import type { Rates } from 'api/rates';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchRateFailure, fetchRateRequest, fetchRateSuccess } from './actions';

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
  typeof fetchRateRequest | typeof fetchRateSuccess | typeof fetchRateFailure | typeof resetState
>;

export function reducer(state = defaultState, action: Action): State {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchRateRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.providerUuid, FetchStatus.inProgress),
      };
    case getType(fetchRateSuccess):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.providerUuid, FetchStatus.complete),
        rates: new Map(state.rates).set(action.meta.providerUuid, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        error: new Map(state.error).set(action.meta.providerUuid, null),
      };
    case getType(fetchRateFailure):
      return {
        ...state,
        error: new Map(state.error).set(action.meta.providerUuid, action.payload),
        status: new Map(state.status).set(action.meta.providerUuid, FetchStatus.complete),
      };
    default:
      return state;
  }
}
