import { CostType } from 'api/costType';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import { invalidateCostType, isCostTypeAvailable, setCostType } from 'utils/localStorage';

import { fetchCostTypeFailure, fetchCostTypeRequest, fetchCostTypeSuccess } from './costTypeActions';

export type CostTypeState = Readonly<{
  byId: Map<string, CostType>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
}>;

export const defaultState: CostTypeState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type CostTypeAction = ActionType<
  typeof fetchCostTypeFailure | typeof fetchCostTypeRequest | typeof fetchCostTypeSuccess
>;

export function costTypeReducer(state = defaultState, action: CostTypeAction): CostTypeState {
  switch (action.type) {
    case getType(fetchCostTypeRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.reportId, FetchStatus.inProgress),
      };
    case getType(fetchCostTypeSuccess):
      initCostType(action.payload.meta['cost-type']);

      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.reportId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.reportId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.reportId, null),
      };
    case getType(fetchCostTypeFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.reportId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.reportId, action.payload),
      };
    default:
      return state;
  }
}

// Initialize default cost type in local storage
function initCostType(costType) {
  // Clear local storage value if current session is not valid
  invalidateCostType();

  if (!isCostTypeAvailable()) {
    setCostType(costType);
  }
}
