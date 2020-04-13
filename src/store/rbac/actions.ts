import { getRBAC, RBAC } from 'api/rbac';
import { Dispatch } from 'react-redux';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchRbacRequest,
  success: fetchRbacSuccess,
  failure: fetchRbacFailure,
} = createAsyncAction(
  'fetch/RBAC/request',
  'fetch/RBAC/success',
  'fetch/RBAC/failure'
)<void, RBAC, Error>();

export const fetchRbac = () => {
  return (dispatch: Dispatch) => {
    dispatch(fetchRbacRequest());
    return getRBAC()
      .then(res => {
        dispatch(fetchRbacSuccess(res));
      })
      .catch(err => {
        dispatch(fetchRbacFailure(err));
      });
  };
};
