import type { AccountSettings } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';
import {
  getAccountCurrency,
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
  updateCostTypeFailure,
  updateCostTypeRequest,
  updateCostTypeSuccess,
  updateCurrencyFailure,
  updateCurrencyRequest,
  updateCurrencySuccess,
} from './accountSettingsActions';

export type AccountSettingsState = Readonly<{
  byId: Map<string, AccountSettings>;
  error?: AxiosError;
  errors?: Map<string, AxiosError>;
  fetchStatus?: Map<string, FetchStatus>;
  status?: FetchStatus;
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
  | typeof updateCostTypeFailure
  | typeof updateCostTypeRequest
  | typeof updateCostTypeSuccess
  | typeof updateCurrencyFailure
  | typeof updateCurrencyRequest
  | typeof updateCurrencySuccess
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
    case getType(updateCostTypeRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(updateCostTypeSuccess):
      return {
        ...state,
        error: null,
        status: FetchStatus.complete,
      };
    case getType(updateCostTypeFailure):
      return {
        ...state,
        error: action.payload,
        status: FetchStatus.complete,
      };
    case getType(updateCurrencyRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(updateCurrencySuccess):
      return {
        ...state,
        error: null,
        status: FetchStatus.complete,
      };
    case getType(updateCurrencyFailure):
      return {
        ...state,
        error: action.payload,
        status: FetchStatus.complete,
      };
    default:
      return state;
  }
}

// Initialize cost type in local storage
function initCostType(value: string) {
  if (!isCostTypeAvailable()) {
    setCostType(value);
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
