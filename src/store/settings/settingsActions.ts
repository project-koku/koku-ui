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
import { selectSettingsError, selectSettingsStatus, selectSettingsUpdateStatus } from './settingsSelectors';

interface SettingsActionMeta {
  fetchId: string;
}

export const fetchSettingsRequest = createAction('settings/fetch/request')<SettingsActionMeta>();
export const fetchSettingsSuccess = createAction('settings/fetch/success')<Settings, SettingsActionMeta>();
export const fetchSettingsFailure = createAction('settings/fetch/failure')<AxiosError, SettingsActionMeta>();

export const updateSettingsRequest = createAction('settings/update/request')<SettingsActionMeta>();
export const updateSettingsSuccess = createAction('settings/update/success')<
  AxiosResponse<SettingsPayload>,
  SettingsActionMeta
>();
export const updateSettingsFailure = createAction('settings/update/failure')<AxiosError, SettingsActionMeta>();

export const resetStatus = createAction('settings/status/reset')();

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
    const fetchStatus = selectSettingsUpdateStatus(state, settingsType);
    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateSettingsRequest(meta));

    let msg;
    let status;
    switch (settingsType) {
      case SettingsType.costCategoriesDisable:
        msg = messages.settingsSuccessCostCategories;
        status = 'disable';
        break;
      case SettingsType.costCategoriesEnable:
        msg = messages.settingsSuccessCostCategories;
        status = 'enable';
        break;
      case SettingsType.platformProjectsAdd:
        msg = messages.settingsSuccessPlatformProjects;
        status = 'add';
        break;
      case SettingsType.platformProjectsRemove:
        msg = messages.settingsSuccessPlatformProjects;
        status = 'remove';
        break;
      case SettingsType.tagsDisable:
        msg = messages.settingsSuccessTags;
        status = 'disable';
        break;
      case SettingsType.tagsEnable:
        msg = messages.settingsSuccessTags;
        status = 'enable';
        break;
      case SettingsType.tagsMappingsChildAdd:
        msg = messages.settingsSuccessTags;
        status = 'add';
        break;
      case SettingsType.tagsMappingsChildRemove:
      case SettingsType.tagsMappingsParentRemove:
        msg = messages.settingsSuccessTags;
        status = 'remove';
        break;
    }

    return apiUpdateSettings(settingsType, payload)
      .then(res => {
        dispatch(updateSettingsSuccess(res, meta));
        dispatch(
          addNotification({
            title: intl.formatMessage(msg, {
              count: payload.ids
                ? payload.ids.length
                : payload.children
                  ? payload.children.length
                  : payload.parent
                    ? payload.parent.length
                    : 0,
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
        let description = intl.formatMessage(messages.settingsErrorDesc);
        let title = intl.formatMessage(messages.settingsErrorTitle);
        if (err.response.status === 412) {
          if (err.response?.data?.enabled && err.response?.data?.limit) {
            description = intl.formatMessage(messages.settingsTagsErrorDesc, { value: err.response.data.enabled });
            title = intl.formatMessage(messages.settingsTagsErrorTitle, { value: err.response.data.limit });
          } else if (err.response?.data?.error && err.response?.data?.ids) {
            description = intl.formatMessage(messages.settingsTagMappingErrorDesc, {
              value: err.response?.data?.ids?.length,
            });
            title = intl.formatMessage(messages.settingsTagMappingErrorTitle);
          }
        }
        dispatch(
          addNotification({
            description,
            dismissable: true,
            title,
            variant: AlertVariant.danger,
          })
        );
      });
  };
}
