import type { Resource } from '@koku-ui/api/resources/resource';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchResourceFailure, fetchResourceRequest, fetchResourceSuccess } from './resourceActions';

export interface CachedResource extends Resource {
  timeRequested: number;
}

export type ResourceState = Readonly<{
  byId: Map<string, CachedResource>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: ResourceState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type ResourceAction = ActionType<
  typeof fetchResourceFailure | typeof fetchResourceRequest | typeof fetchResourceSuccess | typeof resetState
>;

export function resourceReducer(state = defaultState, action: ResourceAction): ResourceState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchResourceRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchResourceSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };

    case getType(fetchResourceFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
