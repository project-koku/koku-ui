import type { Settings } from 'api/settings';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import {
  resetSettingsState,
  updateSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
} from './settingsActions';
import { fetchSettingsFailure, fetchSettingsRequest, fetchSettingsSuccess } from './settingsActions';

export type SettingsState = Readonly<{
  byId: Map<string, Settings>;
  errors?: Map<string, AxiosError>;
  status?: Map<string, FetchStatus>;
}>;

export const defaultState: SettingsState = {
  byId: new Map(),
  errors: new Map(),
  status: new Map(),
};

export type SettingsAction = ActionType<
  | typeof fetchSettingsFailure
  | typeof fetchSettingsRequest
  | typeof fetchSettingsSuccess
  | typeof updateSettingsFailure
  | typeof updateSettingsRequest
  | typeof updateSettingsSuccess
  | typeof resetSettingsState
  | typeof resetState
>;

export function settingsReducer(state = defaultState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case getType(resetState):
    case getType(resetSettingsState):
      state = defaultState;
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
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    case getType(updateSettingsRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(updateSettingsSuccess):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    default:
      return state;
  }
}
