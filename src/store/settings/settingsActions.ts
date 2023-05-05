import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { SettingsPayload } from 'api/settings';
import { updatetSettings as apiUpdateSettings } from 'api/settings';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios/index';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'store/common';
import { createAction } from 'typesafe-actions';

export const updateSettingsRequest = createAction('settings/update/request')<void>();
export const updateSettingsSuccess = createAction('settings/update/success')<AxiosResponse<SettingsPayload>>();
export const updateSettingsFailure = createAction('settings/update/failure')<AxiosError>();

export function updateSettings(payload): ThunkAction {
  return dispatch => {
    dispatch(updateSettingsRequest());

    return apiUpdateSettings(payload)
      .then((res: any) => {
        dispatch(updateSettingsSuccess(res));
        dispatch(
          addNotification({
            title: intl.formatMessage(messages.settingsSuccessTitle),
            description: intl.formatMessage(messages.settingsSuccessDesc),
            variant: AlertVariant.success,
            dismissable: true,
          })
        );
      })
      .catch(err => {
        dispatch(updateSettingsFailure(err));
        dispatch(
          addNotification({
            title: intl.formatMessage(messages.settingsErrorTitle),
            description: intl.formatMessage(messages.settingsErrorDesc),
            variant: AlertVariant.danger,
            dismissable: true,
          })
        );
      });
  };
}
