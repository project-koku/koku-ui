import type { RosData } from 'api/ros';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchRosAvailable, fetchRosFailure, fetchRosRequest, fetchRosSuccess } from './rosActions';

export type RosState = Readonly<{
  available: Map<string, boolean>;
  byId: Map<string, RosData>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
}>;

export const defaultState: RosState = {
  available: new Map(),
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type RosAction = ActionType<
  | typeof fetchRosAvailable
  | typeof fetchRosFailure
  | typeof fetchRosRequest
  | typeof fetchRosSuccess
  | typeof resetState
>;

export function rosReducer(state = defaultState, action: RosAction): RosState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchRosRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchRosSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(fetchRosAvailable):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        available: new Map(state.available).set(action.meta.fetchId, action.payload),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(fetchRosFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
