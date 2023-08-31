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

export const fetchSettingsRequest = createAction('settings/fetch/request')<SettingsActionMeta>();
export const fetchSettingsSuccess = createAction('settings/fetch/success')<Settings, SettingsActionMeta>();
export const fetchSettingsFailure = createAction('settings/fetch/failure')<AxiosError, SettingsActionMeta>();

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

export function updateSettings(settingsType: SettingsType, payload: SettingsPayload): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectSettingsUpdateError(state, settingsType);
    const fetchStatus = selectSettingsUpdateStatus(state, settingsType);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateSettingsRequest(meta));

    let msg;
    let status;
    switch (settingsType) {
      case SettingsType.awsCategoryKeysDisable:
        msg = messages.settingsSuccessCostCategoryKeys;
        status = 'disable';
        break;
      case SettingsType.awsCategoryKeysEnable:
        msg = messages.settingsSuccessCostCategoryKeys;
        status = 'enable';
        break;
      case SettingsType.tagsDisable:
        msg = messages.settingsSuccessTags;
        status = 'disable';
        break;
      case SettingsType.tagsEnable:
        msg = messages.settingsSuccessTags;
        status = 'enable';
        break;
    }

    return apiUpdateSettings(settingsType, payload)
      .then(res => {
        dispatch(updateSettingsSuccess(res, meta));
        dispatch(
          addNotification({
            title: intl.formatMessage(msg, {
              count: payload.ids.length,
              value: status,
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
