import type { Settings, SettingsPayload } from '@koku-ui/api/settings';
import {
  fetchSettings as apiFetchSettings,
  SettingsType,
  updateSettings as apiUpdateSettings,
} from '@koku-ui/api/settings';
import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { AlertVariant } from '@patternfly/react-core';
import type { AxiosError, AxiosResponse } from 'axios';
import { createAction } from 'typesafe-actions';

import type { ThunkAction } from '../common';
import { FetchStatus } from '../common';
import { getFetchId } from './settingsCommon';
import { selectSettingsError, selectSettingsStatus, selectSettingsUpdateStatus } from './settingsSelectors';

interface SettingsActionMeta {
  fetchId: string;
  notification?: any;
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
        const count = payload.ids
          ? payload.ids.length
          : payload.children
            ? payload.children.length
            : payload.parent
              ? payload.parent.length
              : Object.keys(payload).length;

        dispatch(
          updateSettingsSuccess(res, {
            ...meta,
            notification: {
              description: intl.formatMessage(messages.settingsSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(msg, { count, value: status }),
              variant: AlertVariant.success,
            },
          })
        );
      })
      .catch(err => {
        let description = intl.formatMessage(messages.settingsErrorDesc);
        let title = intl.formatMessage(messages.settingsErrorTitle);

        if (settingsType === SettingsType.tagsDisable && err.response.status === 412) {
          if (err.response?.data?.error && err.response?.data?.ids) {
            title = intl.formatMessage(messages.settingsTagMappingDisableErrorTitle);
            description = intl.formatMessage(messages.settingsTagMappingDisableErrorDesc, {
              value: err.response?.data?.ids?.length,
            }) as string;
          } else if (err.response?.data?.enabled && err.response?.data?.limit) {
            title = intl.formatMessage(messages.settingsTagsErrorTitle, { value: err.response.data.limit }) as string;
            description = intl.formatMessage(messages.settingsTagsErrorDesc, {
              value: err.response.data.enabled,
            }) as string;
          }
        } else if (settingsType === SettingsType.tagsMappingsChildAdd) {
          description = intl.formatMessage(messages.tagMappingAddErrorDesc);
          title = intl.formatMessage(messages.tagMappingAddErrorTitle);
        }

        dispatch(
          updateSettingsFailure(err, {
            ...meta,
            notification: {
              description,
              dismissable: true,
              title,
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
}
