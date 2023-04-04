import type { AccountSettings } from 'api/accountSettings';
import { fetchAccountSettings as apiGetAccountSettings } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './accountSettingsCommon';

interface AccountSettingsActionMeta {
  fetchId: string;
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

export function fetchAccountSettings(): ThunkAction {
  return dispatch => {
    const meta: AccountSettingsActionMeta = {
      fetchId: getFetchId(),
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
