import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { AccountSettings, CostTypePayload, CurrencyPayload } from 'api/accountSettings';
import { fetchAccountSettings as apiGetAccountSettings } from 'api/accountSettings';
import { updateCostType as apiUpdateCostType, updateCurrency as apiUpdateCurrency } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './accountSettingsCommon';
import { selectAccountSettingsError, selectAccountSettingsFetchStatus } from './accountSettingsSelectors';

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
export const updateCostTypeRequest = createAction('accountSettings/update/costType/request')<void>();
export const updateCostTypeSuccess = createAction('accountSettings/update/costType/success')<
  AxiosResponse<CostTypePayload>
>();
export const updateCostTypeFailure = createAction('accountSettings/update/costType/failure')<AxiosError>();
export const updateCurrencyRequest = createAction('accountSettings/update/currency/request')<void>();
export const updateCurrencySuccess = createAction('accountSettings/update/currency/success')<
  AxiosResponse<CurrencyPayload>
>();
export const updateCurrencyFailure = createAction('accountSettings/update/currency/failure')<AxiosError>();

export function fetchAccountSettings(): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectAccountSettingsError(state);
    const fetchStatus = selectAccountSettingsFetchStatus(state);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

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

export function updateCostType(payload): ThunkAction {
  return dispatch => {
    dispatch(updateCostTypeRequest());

    return apiUpdateCostType(payload)
      .then((res: any) => {
        dispatch(updateCostTypeSuccess(res));
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
        dispatch(updateCostTypeFailure(err));
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

export function updateCurrency(payload): ThunkAction {
  return dispatch => {
    dispatch(updateCurrencyRequest());

    return apiUpdateCurrency(payload)
      .then((res: any) => {
        dispatch(updateCurrencySuccess(res));
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
        dispatch(updateCurrencyFailure(err));
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
