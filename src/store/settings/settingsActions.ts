import type { SettingsPayload } from 'api/settings';
import { updatetSettings as apiUpdateSettings } from 'api/settings';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios/index';
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
      })
      .catch(err => {
        dispatch(updateSettingsFailure(err));
      });
  };
}
