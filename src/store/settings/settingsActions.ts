import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { Settings, SettingsPayload } from 'api/settings';
import { fetchSettings as apiFetchSettings, SettingsType, updateSettings as apiUpdateSettings } from 'api/settings';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios/index';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './settingsCommon';
import {
  selectSettingsError,
  selectSettingsStatus,
  selectSettingsUpdateError,
  selectSettingsUpdateStatus,
} from './settingsSelectors';

interface SettingsActionMeta {
  fetchId: string;
}

export const fetchSettingsRequest = createAction('accountSettings/fetch/request')<SettingsActionMeta>();
export const fetchSettingsSuccess = createAction('accountSettings/fetch/success')<Settings, SettingsActionMeta>();
export const fetchSettingsFailure = createAction('accountSettings/fetch/failure')<AxiosError, SettingsActionMeta>();

export const updateSettingsRequest = createAction('settings/awsCategoryKeys/update/request')<SettingsActionMeta>();
export const updateSettingsSuccess = createAction('settings/awsCategoryKeys/update/success')<
  AxiosResponse<SettingsPayload>,
  SettingsActionMeta
>();
export const updateSettingsFailure = createAction('settings/awsCategoryKeys/update/failure')<
  AxiosError,
  SettingsActionMeta
>();

export function fetchSettings(settingsType: SettingsType, settingsQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectSettingsError(state, settingsType, settingsQueryString);
    const fetchStatus = selectSettingsStatus(state, settingsType, settingsQueryString);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType, settingsQueryString),
    };

    dispatch(fetchSettingsRequest(meta));

    return apiFetchSettings(settingsType, settingsQueryString)
      .then(res => {
        dispatch(fetchSettingsSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchSettingsFailure(err, meta));
      });
  };
}

export function updateSettings(
  settingsType: SettingsType,
  settingsQueryString: string,
  payload: SettingsPayload
): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectSettingsUpdateError(state, settingsType, settingsQueryString);
    const fetchStatus = selectSettingsUpdateStatus(state, settingsType, settingsQueryString);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType, settingsQueryString),
    };

    dispatch(updateSettingsRequest(meta));

    return apiUpdateSettings(settingsType, payload)
      .then(res => {
        dispatch(updateSettingsSuccess(res, meta));
        dispatch(
          addNotification({
            title: intl.formatMessage(messages.settingsSuccessCostCategoryKeys, {
              ...{ value: settingsType === SettingsType.awsCategoryKeysEnable ? 'enable' : 'disable' },
              count: payload.ids.length,
            }),
            description: intl.formatMessage(messages.settingsSuccessChanges),
            variant: AlertVariant.success,
            dismissable: true,
          })
        );
      })
      .catch(err => {
        dispatch(updateSettingsFailure(err, meta));
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
