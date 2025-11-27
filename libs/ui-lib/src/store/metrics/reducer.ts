import type { Metrics } from '@koku-ui/api/metrics';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchMetricsFailure, fetchMetricsRequest, fetchMetricsSuccess } from './actions';

export const stateKey = 'metrics';

export type MetricsState = Readonly<{
  error: AxiosError;
  status: FetchStatus;
  metrics: Metrics;
}>;

export const defaultState: MetricsState = {
  error: null,
  status: FetchStatus.none,
  metrics: null,
};

export type MetricsAction = ActionType<
  typeof fetchMetricsRequest | typeof fetchMetricsSuccess | typeof fetchMetricsFailure | typeof resetState
>;

export const reducer = (state: MetricsState = defaultState, action: MetricsAction): MetricsState => {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchMetricsSuccess):
      return {
        error: null,
        status: FetchStatus.complete,
        metrics: action.payload.data,
      };
    case getType(fetchMetricsFailure):
      return {
        status: FetchStatus.complete,
        error: action.payload,
        metrics: null,
      };
    case getType(fetchMetricsRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    default:
      return state;
  }
};
