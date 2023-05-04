import type { SettingsPayload } from 'api/settings';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { updateSettingsFailure, updateSettingsRequest, updateSettingsSuccess } from './settingsActions';

export type SettingsState = Readonly<{
  current: SettingsPayload;
  error: AxiosError;
  status?: FetchStatus;
}>;

export const defaultState: SettingsState = {
  current: undefined,
  error: undefined,
  status: undefined,
};

export type SettingsAction = ActionType<
  typeof updateSettingsFailure | typeof updateSettingsRequest | typeof updateSettingsSuccess | typeof resetState
>;

export function settingsReducer(state = defaultState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(updateSettingsRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(updateSettingsSuccess):
      return {
        ...state,
        current: action.payload.data,
        error: null,
        status: FetchStatus.complete,
      };
    case getType(updateSettingsFailure):
      return {
        ...state,
        error: action.payload,
        status: FetchStatus.complete,
      };
    default:
      return state;
  }
}
