import type { Currency } from 'api/currency';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchCurrencyFailure, fetchCurrencyRequest, fetchCurrencySuccess, resetStatus } from './currencyActions';

export type CurrencyState = Readonly<{
  byId: Map<string, Currency>;
  errors?: Map<string, AxiosError>;
  notification?: Map<string, any>;
  status?: Map<string, FetchStatus>;
}>;

export const defaultState: CurrencyState = {
  byId: new Map(),
  errors: new Map(),
  notification: new Map(),
  status: new Map(),
};

export type CurrencyAction = ActionType<
  | typeof fetchCurrencyFailure
  | typeof fetchCurrencyRequest
  | typeof fetchCurrencySuccess
  | typeof resetState
  | typeof resetStatus
>;

export function currencyReducer(state = defaultState, action: CurrencyAction): CurrencyState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(resetStatus): {
      const status = new Map(state.status);
      status.delete(action.payload.fetchId);
      return {
        ...state,
        status,
      };
    }

    case getType(fetchCurrencyFailure):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    case getType(fetchCurrencyRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchCurrencySuccess):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    default:
      return state;
  }
}
