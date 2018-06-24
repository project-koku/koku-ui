import { getCurrentUser as apiGetCurrentUser } from 'api/users';
import { User } from 'api/users';
import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: getUserRequest,
  success: getUserSuccess,
  failure: getUserFailure,
} = createAsyncAction(
  'users/get/request',
  'session/get/success',
  'session/get/failure'
)<{ uuid: string }, User, { uuid: string; error: AxiosError }>();

export const {
  request: getCurrentUserRequest,
  success: getCurrentUserSuccess,
  failure: getCurrentUserFailure,
} = createAsyncAction(
  'users/current/request',
  'session/current/success',
  'session/current/failure'
)<void, User, AxiosError>();

export const getCurrentUser = () => {
  return (dispatch: Dispatch) => {
    dispatch(getCurrentUserRequest());
    return apiGetCurrentUser()
      .then(response => {
        dispatch(getCurrentUserSuccess(response.data));
      })
      .catch(err => {
        dispatch(getCurrentUserFailure(err));
      });
  };
};
