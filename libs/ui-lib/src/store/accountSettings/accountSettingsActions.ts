import type { AccountSettings, AccountSettingsPayload, AccountSettingsType } from '@koku-ui/api/accountSettings';
import {
  fetchAccountSettings as apiFetchAccountSettings,
  updateAccountSettings as apiUpdateAccountSettings,
} from '@koku-ui/api/accountSettings';
import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { AlertVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { createAction } from 'typesafe-actions';

import type { ThunkAction } from '../common';
import { FetchStatus } from '../common';
import { getFetchId } from './accountSettingsCommon';
import {
  selectAccountSettingsError,
  selectAccountSettingsStatus,
  selectAccountSettingsUpdateError,
  selectAccountSettingsUpdateStatus,
} from './accountSettingsSelectors';

interface AccountSettingsActionMeta {
  costType?: string;
  currency?: string;
  fetchId: string;
  notification?: any;
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
export const updateAccountSettingsSuccess = createAction('settings/update/success')<
  AxiosResponse<AccountSettingsPayload>,
  AccountSettingsActionMeta
>();
export const updateAccountSettingsFailure = createAction('settings/update/failure')<
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
      costType: payload.cost_type, // For account cost type update
      currency: payload.currency, // For account currency update
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateAccountSettingsRequest(meta));

    return apiUpdateAccountSettings(settingsType, payload)
      .then(res => {
        dispatch(
          updateAccountSettingsSuccess(res, {
            ...meta,
            notification: {
              description: intl.formatMessage(messages.settingsSuccessDesc),
              dismissable: true,
              title: intl.formatMessage(messages.settingsSuccessTitle),
              variant: AlertVariant.success,
            },
          })
        );
      })
      .catch(err => {
        dispatch(
          updateAccountSettingsFailure(err, {
            ...meta,
            notification: {
              description: intl.formatMessage(messages.settingsErrorDesc),
              dismissable: true,
              title: intl.formatMessage(messages.settingsErrorTitle),
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
}
