import { AlertVariant } from '@patternfly/react-core';
import type { RBAC } from 'api/rbac';
import { getRBAC } from 'api/rbac';
import type { AxiosError } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { Dispatch } from 'redux';
import { createAction } from 'typesafe-actions';

interface RbacActionMeta {
  notification?: any;
}

export const fetchRbacRequest = createAction('settings/RBAC/request')<void>();
export const fetchRbacSuccess = createAction('settings/RBAC/success')<RBAC>();
export const fetchRbacFailure = createAction('settings/RBAC/failure')<AxiosError, RbacActionMeta>();

export const fetchRbac = (): any => {
  return (dispatch: Dispatch) => {
    dispatch(fetchRbacRequest());
    return getRBAC()
      .then(res => {
        dispatch(fetchRbacSuccess(res));
      })
      .catch(err => {
        dispatch(
          fetchRbacFailure(err, {
            notification: {
              description: intl.formatMessage(messages.rbacErrorDesc),
              dismissable: true,
              title: intl.formatMessage(messages.rbacErrorTitle),
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
};
