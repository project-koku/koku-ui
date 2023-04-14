import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { RBAC } from 'api/rbac';
import { getRBAC } from 'api/rbac';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { Dispatch } from 'redux';
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
            title: intl.formatMessage(messages.rbacErrorTitle),
            description: intl.formatMessage(messages.rbacErrorDesc),
            variant: AlertVariant.danger,
            dismissable: true,
          })
        );
        dispatch(fetchRbacFailure(err));
      });
  };
};
