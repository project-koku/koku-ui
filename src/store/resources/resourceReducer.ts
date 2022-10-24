import type { Resource } from 'api/resources/resource';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

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
        fetchStatus: new Map(state.fetchStatus).set(action.payload.resourceId, FetchStatus.inProgress),
      };

    case getType(fetchResourceSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.resourceId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.resourceId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.resourceId, null),
      };

    case getType(fetchResourceFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.resourceId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.resourceId, action.payload),
      };
    default:
      return state;
  }
}
