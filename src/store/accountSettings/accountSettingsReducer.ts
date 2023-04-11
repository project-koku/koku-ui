import type { AccountSettings } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';
import {
  getAccountCurrency,
  invalidateSession,
  isCostTypeAvailable,
  isCurrencyAvailable,
  setAccountCurrency,
  setCostType,
  setCurrency,
} from 'utils/localStorage';

import {
  fetchAccountSettingsFailure,
  fetchAccountSettingsRequest,
  fetchAccountSettingsSuccess,
} from './accountSettingsActions';

export type AccountSettingsState = Readonly<{
  byId: Map<string, AccountSettings>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
}>;

export const defaultState: AccountSettingsState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type AccountSettingsAction = ActionType<
  | typeof fetchAccountSettingsFailure
  | typeof fetchAccountSettingsRequest
  | typeof fetchAccountSettingsSuccess
  | typeof resetState
>;

export function accountSettingsReducer(state = defaultState, action: AccountSettingsAction): AccountSettingsState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchAccountSettingsRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchAccountSettingsSuccess):
      if (action.payload.data) {
        if (action.payload.data.cost_type) {
          initCostType(action.payload.data.cost_type);
        }
        if (action.payload.data.currency) {
          initCurrency(action.payload.data.currency);
        }
      }
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(fetchAccountSettingsFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}

// Initialize cost type in local storage
function initCostType(value: string) {
  // Clear local storage value if current session is not valid
  invalidateSession();

  if (!isCostTypeAvailable()) {
    setCostType(value);
  }
}

// Initialize currency in local storage
function initCurrency(value: string) {
  // Clear local storage value if current session is not valid
  invalidateSession();

  // Reset UI's currency selection if default currency has changed.
  if (value !== getAccountCurrency()) {
    // Todo: After the settings page is moved to the Cost Management UI, we can clear the cached currency there.
    // That way, resetting the currency for the UI should only affect the user who changed the default.
    invalidateSession(true);
  }

  if (!isCurrencyAvailable()) {
    setCurrency(value);
  }
  setAccountCurrency(value);
}
