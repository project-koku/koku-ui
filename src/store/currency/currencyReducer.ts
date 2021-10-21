import { Currency } from 'api/currency';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';

import { fetchCurrencyFailure, fetchCurrencyRequest, fetchCurrencySuccess } from './currencyActions';

export type CurrencyState = Readonly<{
  byId: Map<string, Currency>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
}>;

export const defaultState: CurrencyState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type CurrencyAction = ActionType<
  typeof fetchCurrencyFailure | typeof fetchCurrencyRequest | typeof fetchCurrencySuccess
>;

export function currencyReducer(state = defaultState, action: CurrencyAction): CurrencyState {
  switch (action.type) {
    case getType(fetchCurrencyRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.reportId, FetchStatus.inProgress),
      };
    case getType(fetchCurrencySuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.reportId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.reportId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.reportId, null),
      };
    case getType(fetchCurrencyFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.reportId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.reportId, action.payload),
      };
    default:
      return state;
  }
}
