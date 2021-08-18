import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { getRBAC, RBAC } from 'api/rbac';
import { intl, intlHelper } from 'components/i18n';
import messages from 'locales/messages';
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
            title: intl.formatMessage(messages.RbacErrorTitle),
            description: intlHelper(intl.formatMessage(messages.RbacErrorDescription)),
            variant: 'danger',
            dismissable: true,
          })
        );
        dispatch(fetchRbacFailure(err));
      });
  };
};
