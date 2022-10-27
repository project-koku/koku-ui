import type { RBAC } from 'api/rbac';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchRbacFailure, fetchRbacRequest, fetchRbacSuccess } from './actions';

export const stateKey = 'RBAC';

interface LoadingState {
  status: FetchStatus;
  error: Error;
}

export type RbacState = Readonly<LoadingState & RBAC>;

export const defaultState: RbacState = {
  isOrgAdmin: false,
  permissions: null,
  status: FetchStatus.none,
  error: null,
};

export type RbacAction = ActionType<
  typeof fetchRbacFailure | typeof fetchRbacSuccess | typeof fetchRbacRequest | typeof resetState
>;

export const reducer = (state: RbacState = defaultState, action: RbacAction): RbacState => {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;
    case getType(fetchRbacRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(fetchRbacSuccess):
      return {
        ...action.payload,
        status: FetchStatus.complete,
        error: null,
      };
    case getType(fetchRbacFailure):
      return {
        ...state,
        status: FetchStatus.complete,
        error: action.payload,
      };
    default:
      return state;
  }
};
