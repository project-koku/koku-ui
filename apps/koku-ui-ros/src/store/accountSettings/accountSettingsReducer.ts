import type { AccountSettings } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';
import { getAccountCurrency, isCurrencyAvailable, setAccountCurrency, setCurrency } from 'utils/sessionStorage';

import {
  fetchAccountSettingsFailure,
  fetchAccountSettingsRequest,
  fetchAccountSettingsSuccess,
  updateAccountSettingsFailure,
  updateAccountSettingsRequest,
  updateAccountSettingsSuccess,
} from './accountSettingsActions';

export type AccountSettingsState = Readonly<{
  byId: Map<string, AccountSettings>;
  errors?: Map<string, AxiosError>;
  notification?: Map<string, any>;
  status?: Map<string, FetchStatus>;
}>;

export const defaultState: AccountSettingsState = {
  byId: new Map(),
  errors: new Map(),
  notification: new Map(),
  status: new Map(),
};

export type AccountSettingsAction = ActionType<
  | typeof fetchAccountSettingsFailure
  | typeof fetchAccountSettingsRequest
  | typeof fetchAccountSettingsSuccess
  | typeof updateAccountSettingsFailure
  | typeof updateAccountSettingsRequest
  | typeof updateAccountSettingsSuccess
  | typeof resetState
>;

export function accountSettingsReducer(state = defaultState, action: AccountSettingsAction): AccountSettingsState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchAccountSettingsFailure):
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    case getType(fetchAccountSettingsRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchAccountSettingsSuccess):
      if (action.payload.data) {
        if (action.payload.data.currency) {
          initCurrency(action.payload.data.currency);
        }
      }
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(updateAccountSettingsFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };
    case getType(updateAccountSettingsRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(updateAccountSettingsSuccess):
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

// Initialize currency in local storage
function initCurrency(value: string) {
  // Reset UI's currency selection if default currency has changed.
  const accountCurrency = getAccountCurrency();
  if (accountCurrency && accountCurrency !== value) {
    // Todo: remove account currency after settings page has been moved
    // That way, resetting the currency for the UI should only affect the user who changed the default.
    setCurrency(accountCurrency);
  }
  if (!isCurrencyAvailable()) {
    setCurrency(value);
  }
  setAccountCurrency(value);
}
