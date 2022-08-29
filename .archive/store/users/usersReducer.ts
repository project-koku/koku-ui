import { User } from 'api/users';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  getCurrentUserFailure,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getUserFailure,
  getUserRequest,
  getUserSuccess,
} from './usersActions';

export type UsersAction = ActionType<
  | typeof getUserRequest
  | typeof getUserSuccess
  | typeof getUserFailure
  | typeof getCurrentUserRequest
  | typeof getCurrentUserSuccess
  | typeof getCurrentUserFailure
>;

export type UsersState = Readonly<{
  byId: Map<string, User>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

export const defaultState: UsersState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export const stateKey = 'users';

export function usersReducer(
  state = defaultState,
  action: UsersAction
): UsersState {
  switch (action.type) {
    case getType(getCurrentUserRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          'current',
          FetchStatus.inProgress
        ),
      };
    case getType(getCurrentUserSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          'current',
          FetchStatus.complete
        ),
        byId: new Map(state.byId).set('current', action.payload),
        errors: new Map(state.errors).set('current', null),
      };
    case getType(getCurrentUserFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          'current',
          FetchStatus.complete
        ),
        errors: new Map(state.errors).set('current', action.payload),
      };
    default:
      return state;
  }
}
