import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
} from './sessionActions';

export type SessionAction = ActionType<
  | typeof loginRequest
  | typeof loginSuccess
  | typeof loginFailure
  | typeof logout
>;

export type SessionState = Readonly<{
  token: string;
  loginFetchStatus: FetchStatus;
  loginError: AxiosError;
}>;

export const defaultState: SessionState = {
  token: null,
  loginFetchStatus: FetchStatus.none,
  loginError: null,
};

export const stateKey = 'session';

export function sessionReducer(
  state = defaultState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case getType(loginRequest):
      return {
        ...state,
        loginFetchStatus: FetchStatus.inProgress,
      };
    case getType(loginSuccess):
      return {
        ...state,
        token: action.payload,
        loginError: null,
        loginFetchStatus: FetchStatus.complete,
      };
    case getType(loginFailure):
      return {
        ...state,
        token: null,
        loginFetchStatus: FetchStatus.complete,
        loginError: action.payload,
      };
    case getType(logout):
      return { ...defaultState };
    default:
      return state;
  }
}
