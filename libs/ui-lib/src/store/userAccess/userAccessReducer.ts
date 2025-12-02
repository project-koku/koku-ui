import type { UserAccess } from '@koku-ui/api/userAccess';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchUserAccessFailure, fetchUserAccessRequest, fetchUserAccessSuccess } from './userAccessActions';

export type UserAccessState = Readonly<{
  byId: Map<string, UserAccess>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
}>;

export const defaultState: UserAccessState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type UserAccessAction = ActionType<
  typeof fetchUserAccessFailure | typeof fetchUserAccessRequest | typeof fetchUserAccessSuccess | typeof resetState
>;

export function userAccessReducer(state = defaultState, action: UserAccessAction): UserAccessState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchUserAccessRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };
    case getType(fetchUserAccessSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };
    case getType(fetchUserAccessFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
