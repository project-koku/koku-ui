import type { Ros } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchRosFailure, fetchRosRequest, fetchRosSuccess } from './rosActions';

export interface CachedRos extends Ros {
  timeRequested: number;
}

export type RosState = Readonly<{
  byId: Map<string, CachedRos>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: RosState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type RosAction = ActionType<
  typeof fetchRosFailure | typeof fetchRosRequest | typeof fetchRosSuccess | typeof resetState
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
          timeRequested: Date.now(),
        }),
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
