import { AlertVariant } from '@patternfly/react-core';
import type {
  Settings,
  SettingsCategoryPayload,
  SettingsPlatformPayload,
  SettingsRatePayload,
  SettingsTagPayload,
  UpdateCurrencySettingsArgs,
} from 'api/settings';
import {
  fetchSettings as apiFetchSettings,
  SettingsType,
  updateCategorySettings as apiUpdateCategorySettings,
  updateCurrencySettings as apiUpdateCurrencySettings,
  updatePlatformSettings as apiUpdatePlatformSettings,
  updateTagSettings as apiUpdateTagSettings,
} from 'api/settings';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios/index';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { getErrorNotification } from 'routes/settings/utils';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './settingsCommon';
import { selectSettingsError, selectSettingsFetchStatus } from './settingsSelectors';

interface SettingsActionMeta {
  fetchId: string;
  notification?: any;
}

export const fetchSettingsRequest = createAction('settings/fetch/request')<SettingsActionMeta>();
export const fetchSettingsSuccess = createAction('settings/fetch/success')<Settings, SettingsActionMeta>();
export const fetchSettingsFailure = createAction('settings/fetch/failure')<AxiosError, SettingsActionMeta>();

export const updateCategorySettingsRequest = createAction('settings/category/update/request')<SettingsActionMeta>();
export const updateCategorySettingsSuccess = createAction('settings/category/update/success')<
  AxiosResponse<SettingsCategoryPayload>,
  SettingsActionMeta
>();
export const updateCategorySettingsFailure = createAction('settings/category/update/failure')<
  AxiosError,
  SettingsActionMeta
>();

export const updateCurrencySettingsRequest = createAction('settings/currency/update/request')<SettingsActionMeta>();
export const updateCurrencySettingsSuccess = createAction('settings/currency/update/success')<
  AxiosResponse<SettingsRatePayload>,
  SettingsActionMeta
>();
export const updateCurrencySettingsFailure = createAction('settings/currency/update/failure')<
  AxiosError,
  SettingsActionMeta
>();

export const updatePlatformSettingsRequest = createAction('settings/platform/update/request')<SettingsActionMeta>();
export const updatePlatformSettingsSuccess = createAction('settings/platform/update/success')<
  AxiosResponse<SettingsPlatformPayload[]>,
  SettingsActionMeta
>();
export const updatePlatformSettingsFailure = createAction('settings/platform/update/failure')<
  AxiosError,
  SettingsActionMeta
>();

export const updateTagSettingsRequest = createAction('settings/tag/update/request')<SettingsActionMeta>();
export const updateTagSettingsSuccess = createAction('settings/tag/update/success')<
  AxiosResponse<SettingsTagPayload>,
  SettingsActionMeta
>();
export const updateTagSettingsFailure = createAction('settings/tag/update/failure')<AxiosError, SettingsActionMeta>();

export const resetNotifications = createAction('settings/notification/reset')<{ fetchId: string }>();
export const resetStatus = createAction('settings/status/reset')<{ fetchId: string }>();

export function fetchSettings(settingsType: SettingsType, settingsQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectSettingsError(state, settingsType, settingsQueryString);
    const fetchStatus = selectSettingsFetchStatus(state, settingsType, settingsQueryString);
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

export function updateCategorySettings(settingsType: SettingsType, payload: SettingsCategoryPayload): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchStatus = selectSettingsFetchStatus(state, settingsType, undefined);

    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateCategorySettingsRequest(meta));

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
    }

    return apiUpdateCategorySettings(settingsType, payload)
      .then(res => {
        const count = payload.ids?.length ?? Object.keys(payload).length;

        dispatch(
          updateCategorySettingsSuccess(res, {
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
        dispatch(
          updateCategorySettingsFailure(err, {
            ...meta,
            notification: getErrorNotification(
              err,
              intl.formatMessage(messages.settingsErrorTitle),
              intl.formatMessage(messages.settingsErrorDesc)
            ),
          })
        );
      });
  };
}

export function updateCurrencySettings(args: UpdateCurrencySettingsArgs): ThunkAction {
  return (dispatch, getState) => {
    const { settingsType } = args;
    const state = getState();
    const fetchStatus = selectSettingsFetchStatus(state, settingsType, undefined);

    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateCurrencySettingsRequest(meta));

    let msg;
    let status;
    switch (settingsType) {
      case SettingsType.currencyAdd:
        msg = messages.settingsSuccessCurrency;
        status = 'add';
        break;
      case SettingsType.currencyDelete:
        msg = messages.settingsSuccessCurrency;
        status = 'delete';
        break;
      case SettingsType.currencyDisable:
        msg = messages.settingsSuccessCurrency;
        status = 'disable';
        break;
      case SettingsType.currencyEdit:
        msg = messages.settingsSuccessCurrency;
        status = 'edit';
        break;
      case SettingsType.currencyEnable:
        msg = messages.settingsSuccessCurrency;
        status = 'enable';
        break;
    }

    return apiUpdateCurrencySettings(args)
      .then(res => {
        dispatch(
          updateCurrencySettingsSuccess(res, {
            ...meta,
            notification: {
              description: intl.formatMessage(messages.settingsSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(msg, { value: status }),
              variant: AlertVariant.success,
            },
          })
        );
      })
      .catch(err => {
        let description = intl.formatMessage(messages.settingsErrorDesc);
        let title = intl.formatMessage(messages.settingsErrorTitle);

        if (settingsType === SettingsType.currencyAdd) {
          description = intl.formatMessage(messages.currencyAddErrorDesc);
          title = intl.formatMessage(messages.currencyAddErrorTitle);
        } else if (settingsType === SettingsType.currencyDelete) {
          description = intl.formatMessage(messages.currencyDeleteErrorDesc);
          title = intl.formatMessage(messages.currencyDeleteErrorTitle);
        } else if (settingsType === SettingsType.currencyDisable) {
          description = intl.formatMessage(messages.currencyDisableErrorDesc);
          title = intl.formatMessage(messages.currencyDisableErrorTitle);
        } else if (settingsType === SettingsType.currencyEdit) {
          description = intl.formatMessage(messages.currencyEditErrorDesc);
          title = intl.formatMessage(messages.currencyEditErrorTitle);
        } else if (settingsType === SettingsType.currencyEnable) {
          description = intl.formatMessage(messages.currencyEnableErrorDesc);
          title = intl.formatMessage(messages.currencyEnableErrorTitle);
        }

        dispatch(
          updateCurrencySettingsFailure(err, {
            ...meta,
            notification: getErrorNotification(err, title, description),
          })
        );
      });
  };
}

export function updatePlatformSettings(settingsType: SettingsType, payload: SettingsPlatformPayload[]): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchStatus = selectSettingsFetchStatus(state, settingsType, undefined);

    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updatePlatformSettingsRequest(meta));

    let msg;
    let status;
    switch (settingsType) {
      case SettingsType.platformProjectsAdd:
        msg = messages.settingsSuccessPlatformProjects;
        status = 'add';
        break;
      case SettingsType.platformProjectsRemove:
        msg = messages.settingsSuccessPlatformProjects;
        status = 'remove';
        break;
    }

    return apiUpdatePlatformSettings(settingsType, payload)
      .then(res => {
        const count = payload.length;

        dispatch(
          updatePlatformSettingsSuccess(res, {
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
        dispatch(
          updatePlatformSettingsFailure(err, {
            ...meta,
            notification: getErrorNotification(
              err,
              intl.formatMessage(messages.settingsErrorTitle),
              intl.formatMessage(messages.settingsErrorDesc)
            ),
          })
        );
      });
  };
}

export function updateTagSettings(settingsType: SettingsType, payload: SettingsTagPayload): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchStatus = selectSettingsFetchStatus(state, settingsType, undefined);

    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: SettingsActionMeta = {
      fetchId: getFetchId(settingsType),
    };

    dispatch(updateTagSettingsRequest(meta));

    let msg;
    let status;
    switch (settingsType) {
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

    return apiUpdateTagSettings(settingsType, payload)
      .then(res => {
        const count = payload.ids
          ? payload.ids.length
          : payload.children
            ? payload.children.length
            : payload.parent
              ? 1
              : Object.keys(payload).length;

        dispatch(
          updateTagSettingsSuccess(res, {
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
          updateTagSettingsFailure(err, {
            ...meta,
            notification: getErrorNotification(err, title, description),
          })
        );
      });
  };
}
