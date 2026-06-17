import { AlertVariant } from '@patternfly/react-core';
import type { DataRetention, DataRetentionPayload } from 'api/dataRetention';
import { DataRetentionType } from 'api/dataRetention';
import {
  fetchDataRetention as apiFetchDataRetention,
  updateDataRetention as apiUpdateDataRetention,
} from 'api/dataRetention';
import type { AxiosError, AxiosResponse } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './dataRetentionCommon';
import { selectDataRetentionError, selectDataRetentionFetchStatus } from './dataRetentionSelectors';

interface DataRetentionActionMeta {
  fetchId: string;
  notification?: any;
}

// Reset notification and status

export const resetNotifications = createAction('dataRetention/notifications/reset')();
export const resetStatus = createAction('dataRetention/status/reset')();

// Fetch price list

export const fetchDataRetentionRequest = createAction('dataRetention/request')<DataRetentionActionMeta>();
export const fetchDataRetentionSuccess = createAction('dataRetention/success')<
  DataRetention,
  DataRetentionActionMeta
>();
export const fetchDataRetentionFailure = createAction('dataRetention/failure')<AxiosError, DataRetentionActionMeta>();

export function fetchDataRetention(
  dataRetentionType: DataRetentionType,
  uuid?: string,
  dataRetentionQueryString?: string
): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const error = selectDataRetentionError(state, dataRetentionType, dataRetentionQueryString);
    const status = selectDataRetentionFetchStatus(state, dataRetentionType, dataRetentionQueryString);
    if (error || status === FetchStatus.inProgress) {
      return;
    }

    const meta: DataRetentionActionMeta = {
      fetchId: getFetchId(dataRetentionType, dataRetentionQueryString),
    };

    dispatch(fetchDataRetentionRequest(meta));

    return apiFetchDataRetention(dataRetentionType, uuid, dataRetentionQueryString)
      .then(res => {
        dispatch(fetchDataRetentionSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchDataRetentionFailure(err, meta));
      });
  };
}

// Update price list

export const updateDataRetentionRequest = createAction('dataRetention/update/request')<DataRetentionActionMeta>();
export const updateDataRetentionSuccess = createAction('dataRetention/update/success')<
  AxiosResponse<DataRetentionPayload>,
  DataRetentionActionMeta
>();
export const updateDataRetentionFailure = createAction('dataRetention/update/failure')<
  AxiosError,
  DataRetentionActionMeta
>();

export function updateDataRetention(
  dataRetentionType: DataRetentionType,
  uuid?: string,
  payload?: DataRetentionPayload
): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchStatus = selectDataRetentionFetchStatus(state, dataRetentionType, undefined);

    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: DataRetentionActionMeta = {
      fetchId: getFetchId(dataRetentionType, undefined),
    };

    dispatch(updateDataRetentionRequest(meta));

    let status;
    switch (dataRetentionType) {
      case DataRetentionType.dataRetentionUpdate:
        status = 'update';
        break;
    }

    return apiUpdateDataRetention(dataRetentionType, uuid, payload)
      .then(res => {
        dispatch(
          updateDataRetentionSuccess(res, {
            ...meta,
            notification: {
              description: intl.formatMessage(messages.dataRetentionSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(messages.dataRetentionSuccess, { value: status }),
              variant: AlertVariant.success,
            },
          })
        );
      })
      .catch(err => {
        const description = intl.formatMessage(messages.dataRetentionErrorDesc, { value: status });
        const title = intl.formatMessage(messages.dataRetentionErrorTitle, { value: status });

        dispatch(
          updateDataRetentionFailure(err, {
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
