import type { AccountSettings } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';
import {
  isCostTypeAvailable,
  isCurrencyAvailable,
  setAccountCostType,
  setAccountCurrency,
  setCostType,
  setCurrency,
} from 'utils/localStorage';

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
  status?: Map<string, FetchStatus>;
}>;

export const defaultState: AccountSettingsState = {
  byId: new Map(),
  errors: new Map(),
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
      if (action?.payload?.data?.cost_type) {
        setAccountCostType(action.payload.data.cost_type);
        initCostType(action.payload.data.cost_type);
      }
      if (action?.payload?.data?.currency) {
        setAccountCurrency(action.payload.data.currency);
        initCurrency(action.payload.data.currency);
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
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    case getType(updateAccountSettingsRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(updateAccountSettingsSuccess):
      if (action?.meta?.costType) {
        setAccountCostType(action.meta.costType);
        initCostType(action.meta.costType, true); // Reset UI's cost type selection to match default cost type
      }
      if (action?.meta?.currency) {
        setAccountCurrency(action.meta.currency);
        initCurrency(action.meta.currency, true); // Reset UI's currency selection to match default currency
      }
      return {
        ...state,
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    default:
      return state;
  }
}

// Initialize cost type in local storage
function initCostType(value: string, reset = false) {
  // Set if not defined
  if (!isCostTypeAvailable() || reset) {
    setCostType(value);
  }
}

// Initialize currency in local storage
function initCurrency(value: string, reset = false) {
  // Set if not defined
  if (!isCurrencyAvailable() || reset) {
    setCurrency(value);
  }
}
