import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { AccountSettings, AccountSettingsPayload, AccountSettingsType } from 'api/accountSettings';
import {
  fetchAccountSettings as apiFetchAccountSettings,
  updateAccountSettings as apiUpdateAccountSettings,
} from 'api/accountSettings';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './accountSettingsCommon';
import {
  selectAccountSettingsError,
  selectAccountSettingsStatus,
  selectAccountSettingsUpdateError,
  selectAccountSettingsUpdateStatus,
} from './accountSettingsSelectors';

interface AccountSettingsActionMeta {
  fetchId: string;
}

export const fetchAccountSettingsRequest = createAction('settings/fetch/request')<AccountSettingsActionMeta>();
export const fetchAccountSettingsSuccess = createAction('settings/fetch/success')<
  AccountSettings,
  AccountSettingsActionMeta
>();
export const fetchAccountSettingsFailure = createAction('settings/fetch/failure')<
  AxiosError,
  AccountSettingsActionMeta
>();

export const updateAccountSettingsRequest = createAction(
  'settings/awsCategoryKeys/update/request'
)<AccountSettingsActionMeta>();
export const updateAccountSettingsSuccess = createAction('settings/awsCategoryKeys/update/success')<
  AxiosResponse<AccountSettingsPayload>,
  AccountSettingsActionMeta
>();
export const updateAccountSettingsFailure = createAction('settings/awsCategoryKeys/update/failure')<
  AxiosError,
  AccountSettingsActionMeta
>();

export function fetchAccountSettings(settingsType: AccountSettingsType): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectAccountSettingsError(state, settingsType);
    const fetchStatus = selectAccountSettingsStatus(state, settingsType);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: AccountSettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(fetchAccountSettingsRequest(meta));

    return apiFetchAccountSettings(settingsType)
      .then(res => {
        dispatch(fetchAccountSettingsSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchAccountSettingsFailure(err, meta));
      });
  };
}

export function updateAccountSettings(settingsType: AccountSettingsType, payload: AccountSettingsPayload): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectAccountSettingsUpdateError(state, settingsType);
    const fetchStatus = selectAccountSettingsUpdateStatus(state, settingsType);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: AccountSettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateAccountSettingsRequest(meta));

    return apiUpdateAccountSettings(settingsType, payload)
      .then(res => {
        dispatch(updateAccountSettingsSuccess(res, meta));
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
        dispatch(updateAccountSettingsFailure(err, meta));
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
