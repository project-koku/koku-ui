import type { DataRetention } from 'api/dataRetention';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import {
  fetchDataRetentionFailure,
  fetchDataRetentionRequest,
  fetchDataRetentionSuccess,
  resetNotifications,
  resetStatus,
  updateDataRetentionFailure,
  updateDataRetentionRequest,
  updateDataRetentionSuccess,
} from './dataRetentionActions';

export interface CachedDataRetention extends DataRetention {
  timeRequested?: number;
}

export type DataRetentionState = Readonly<{
  byId: Map<string, CachedDataRetention>;
  errors: Map<string, AxiosError>;
  notification?: Map<string, any>;
  status: Map<string, FetchStatus>;
}>;

const defaultState: DataRetentionState = {
  byId: new Map(),
  errors: new Map(),
  notification: new Map(),
  status: new Map(),
};

export type DataRetentionAction = ActionType<
  | typeof fetchDataRetentionFailure
  | typeof fetchDataRetentionRequest
  | typeof fetchDataRetentionSuccess
  | typeof resetNotifications
  | typeof resetState
  | typeof resetStatus
  | typeof updateDataRetentionFailure
  | typeof updateDataRetentionRequest
  | typeof updateDataRetentionSuccess
>;

export function dataRetentionReducer(state = defaultState, action: DataRetentionAction): DataRetentionState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(resetNotifications):
      state = {
        ...state,
        notification: new Map(),
      };
      return state;

    case getType(resetStatus):
      state = {
        ...state,
        status: new Map(),
      };
      return state;

    case getType(fetchDataRetentionRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchDataRetentionSuccess):
      return {
        ...state,
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };

    case getType(fetchDataRetentionFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };

    case getType(updateDataRetentionFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };

    case getType(updateDataRetentionRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(updateDataRetentionSuccess):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, null),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };
    default:
      return state;
  }
}
