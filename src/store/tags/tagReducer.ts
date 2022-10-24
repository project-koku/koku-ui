import type { Tag } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

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
        fetchStatus: new Map(state.fetchStatus).set(action.payload.tagId, FetchStatus.inProgress),
      };

    case getType(fetchTagSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.tagId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.tagId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.tagId, null),
      };

    case getType(fetchTagFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.tagId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.tagId, action.payload),
      };
    default:
      return state;
  }
}
