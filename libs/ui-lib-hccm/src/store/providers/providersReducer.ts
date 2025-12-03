import type { Providers } from '@koku-ui/api/providers';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchProvidersFailure, fetchProvidersRequest, fetchProvidersSuccess } from './providersActions';

export interface CachedProviders extends Providers {
  timeRequested: number;
}

export type ProvidersState = Readonly<{
  byId: Map<string, CachedProviders>;
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
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchProvidersSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(fetchProvidersFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
