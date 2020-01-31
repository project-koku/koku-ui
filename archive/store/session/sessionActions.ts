import {
  login as apiLogin,
  LoginRequest,
  logout as apiLogout,
} from 'api/session';
import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const {
  request: loginRequest,
  success: loginSuccess,
  failure: loginFailure,
} = createAsyncAction(
  'session/login/request',
  'session/login/success',
  'session/login/failure'
)<void, string, AxiosError>();

export function login(request: LoginRequest) {
  return (dispatch: Dispatch) => {
    dispatch(loginRequest());
    return apiLogin(request)
      .then(response => {
        dispatch(loginSuccess('token'));
      })
      .catch(err => {
        dispatch(loginFailure(err));
      });
  };
}

export const logout = createAction('session/logout', resolve => {
  return () => {
    apiLogout();
    return resolve();
  };
});
