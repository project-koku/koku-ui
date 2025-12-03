import type { RBAC } from '@koku-ui/api/rbac';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchRbacFailure, fetchRbacRequest, fetchRbacSuccess } from './actions';

export const stateKey = 'RBAC';

export interface LoadingState {
  error: AxiosError;
  notification?: any;
  status: FetchStatus;
}

export type RbacState = Readonly<LoadingState & RBAC>;

export const defaultState: RbacState = {
  error: null,
  isOrgAdmin: false,
  notification: undefined,
  permissions: null,
  status: FetchStatus.none,
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
        error: null,
        status: FetchStatus.complete,
      };
    case getType(fetchRbacFailure):
      return {
        ...state,
        error: action.payload,
        notification: action.meta.notification,
        status: FetchStatus.complete,
      };
    default:
      return state;
  }
};
