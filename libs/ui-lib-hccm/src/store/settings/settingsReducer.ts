import type { Settings } from '@koku-ui/api/settings';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { resetStatus, updateSettingsFailure, updateSettingsRequest, updateSettingsSuccess } from './settingsActions';
import { fetchSettingsFailure, fetchSettingsRequest, fetchSettingsSuccess } from './settingsActions';

export type SettingsState = Readonly<{
  byId: Map<string, Settings>;
  errors?: Map<string, AxiosError>;
  notification?: Map<string, any>;
  status?: Map<string, FetchStatus>;
}>;

export const defaultState: SettingsState = {
  byId: new Map(),
  errors: new Map(),
  notification: new Map(),
  status: new Map(),
};

export type SettingsAction = ActionType<
  | typeof fetchSettingsFailure
  | typeof fetchSettingsRequest
  | typeof fetchSettingsSuccess
  | typeof updateSettingsFailure
  | typeof updateSettingsRequest
  | typeof updateSettingsSuccess
  | typeof resetState
  | typeof resetStatus
>;

export function settingsReducer(state = defaultState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(resetStatus):
      state = {
        ...state,
        status: new Map(),
      };
      return state;

    case getType(fetchSettingsFailure):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    case getType(fetchSettingsRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchSettingsSuccess):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(updateSettingsFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };
    case getType(updateSettingsRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(updateSettingsSuccess):
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
