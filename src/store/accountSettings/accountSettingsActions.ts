import type { AccountSettings } from 'api/accountSettings';
import { fetchAccountSettings as apiGetAccountSettings } from 'api/accountSettings';
import { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import { getReportId } from './accountSettingsCommon';

interface AccountSettingsActionMeta {
  reportId: string;
}

export const fetchAccountSettingsRequest = createAction('accountSettings/fetch/request')<AccountSettingsActionMeta>();
export const fetchAccountSettingsSuccess = createAction('accountSettings/fetch/success')<
  AccountSettings,
  AccountSettingsActionMeta
>();
export const fetchAccountSettingsFailure = createAction('accountSettings/fetch/failure')<
  AxiosError,
  AccountSettingsActionMeta
>();

export function fetchAccountSettings() {
  return dispatch => {
    const meta: AccountSettingsActionMeta = {
      reportId: getReportId(),
    };

    dispatch(fetchAccountSettingsRequest(meta));

    return apiGetAccountSettings()
      .then(res => {
        dispatch(fetchAccountSettingsSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchAccountSettingsFailure(err, meta));
      });
  };
}
