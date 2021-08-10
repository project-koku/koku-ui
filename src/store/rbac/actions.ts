import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { getRBAC, RBAC } from 'api/rbac';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchRbacRequest,
  success: fetchRbacSuccess,
  failure: fetchRbacFailure,
} = createAsyncAction('fetch/RBAC/request', 'fetch/RBAC/success', 'fetch/RBAC/failure')<void, RBAC, Error>();

export const fetchRbac = (): any => {
  const intl = createIntlEnv();
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
            description: intl.formatMessage(messages.RbacErrorDescription),
            variant: 'danger',
            dismissable: true,
          })
        );
        dispatch(fetchRbacFailure(err));
      });
  };
};
