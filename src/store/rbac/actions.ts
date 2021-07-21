import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { getRBAC, RBAC } from 'api/rbac';
import i18next from 'i18next';
import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchRbacRequest,
  success: fetchRbacSuccess,
  failure: fetchRbacFailure,
} = createAsyncAction('fetch/RBAC/request', 'fetch/RBAC/success', 'fetch/RBAC/failure')<void, RBAC, Error>();

export const fetchRbac = (): any => {
  return (dispatch: Dispatch) => {
    dispatch(fetchRbacRequest());
    return getRBAC()
      .then(res => {
        dispatch(fetchRbacSuccess(res));
      })
      .catch(err => {
        dispatch(
          addNotification({
            title: i18next.t('rbac.error_title'),
            description: i18next.t('rbac.error_description'),
            variant: 'danger',
            dismissable: true,
          })
        );
        dispatch(fetchRbacFailure(err));
      });
  };
};
