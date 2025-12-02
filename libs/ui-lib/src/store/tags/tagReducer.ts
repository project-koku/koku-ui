import type { Tag } from '@koku-ui/api/tags/tag';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchTagFailure, fetchTagRequest, fetchTagSuccess } from './tagActions';

export interface CachedTag extends Tag {
  timeRequested: number;
}

export type TagState = Readonly<{
  byId: Map<string, CachedTag>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: TagState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type TagAction = ActionType<
  typeof fetchTagFailure | typeof fetchTagRequest | typeof fetchTagSuccess | typeof resetState
>;

export function tagReducer(state = defaultState, action: TagAction): TagState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchTagRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchTagSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };

    case getType(fetchTagFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
