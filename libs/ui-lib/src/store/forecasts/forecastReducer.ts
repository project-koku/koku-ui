import type { Forecast } from '@koku-ui/api/forecasts/forecast';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchForecastFailure, fetchForecastRequest, fetchForecastSuccess } from './forecastActions';

export interface CachedForecast extends Forecast {
  timeRequested: number;
}

export type ForecastState = Readonly<{
  byId: Map<string, CachedForecast>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: ForecastState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type ForecastAction = ActionType<
  typeof fetchForecastFailure | typeof fetchForecastRequest | typeof fetchForecastSuccess | typeof resetState
>;

export function forecastReducer(state = defaultState, action: ForecastAction): ForecastState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchForecastRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchForecastSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };

    case getType(fetchForecastFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
