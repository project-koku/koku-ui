import type { Providers } from 'api/providers';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchProvidersFailure, fetchProvidersRequest, fetchProvidersSuccess } from './providersActions';

export type ProvidersState = Readonly<{
  byId: Map<string, Providers>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
}>;

export const defaultState: ProvidersState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type ProvidersAction = ActionType<
  typeof fetchProvidersFailure | typeof fetchProvidersRequest | typeof fetchProvidersSuccess | typeof resetState
>;

export function providersReducer(state = defaultState, action: ProvidersAction): ProvidersState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchProvidersRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.reportId, FetchStatus.inProgress),
      };
    case getType(fetchProvidersSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.reportId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.reportId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.reportId, null),
      };
    case getType(fetchProvidersFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.reportId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.reportId, action.payload),
      };
    default:
      return state;
  }
}
