import { AlertVariant } from '@patternfly/react-core';
import type { PriceList, PriceListPayload } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import { fetchPriceList as apiFetchPriceList, updatePriceList as apiUpdatePriceList } from 'api/priceList';
import type { AxiosError, AxiosResponse } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './priceListCommon';
import {
  selectPriceListError,
  selectPriceListFetchStatus,
  selectPriceListUpdateFetchStatus,
} from './priceListSelectors';

interface PriceListActionMeta {
  fetchId: string;
  notification?: any;
}

export const fetchPriceListRequest = createAction('priceList/request')<PriceListActionMeta>();
export const fetchPriceListSuccess = createAction('priceList/success')<PriceList, PriceListActionMeta>();
export const fetchPriceListFailure = createAction('priceList/failure')<AxiosError, PriceListActionMeta>();

export const updatePriceListRequest = createAction('priceList/update/request')<PriceListActionMeta>();
export const updatePriceListSuccess = createAction('priceList/update/success')<
  AxiosResponse<PriceListPayload>,
  PriceListActionMeta
>();
export const updatePriceListFailure = createAction('priceList/update/failure')<AxiosError, PriceListActionMeta>();

export function fetchPriceList(priceListType: PriceListType, priceListQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectPriceListError(state, priceListType, priceListQueryString);
    const fetchStatus = selectPriceListFetchStatus(state, priceListType, priceListQueryString);
    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: PriceListActionMeta = {
      fetchId: getFetchId(priceListType, priceListQueryString),
    };

    dispatch(fetchPriceListRequest(meta));

    return apiFetchPriceList(priceListType, priceListQueryString)
      .then(res => {
        dispatch(fetchPriceListSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchPriceListFailure(err, meta));
      });
  };
}

export function updatePriceList(priceListType: PriceListType, query?: string, payload?: PriceListPayload): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchStatus = selectPriceListUpdateFetchStatus(state, priceListType);

    if (fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: PriceListActionMeta = {
      fetchId: getFetchId(priceListType),
    };

    dispatch(updatePriceListRequest(meta));

    let msg;
    let status;
    switch (priceListType) {
      case PriceListType.priceListAdd:
        msg = messages.priceListSuccess;
        status = 'add';
        break;
      case PriceListType.priceListRemove:
        msg = messages.priceListSuccess;
        status = 'remove';
        break;
      case PriceListType.priceListUpdate:
        msg = messages.priceListSuccess;
        status = 'update';
        break;
    }

    return apiUpdatePriceList(priceListType, query, payload)
      .then(res => {
        dispatch(
          updatePriceListSuccess(res, {
            ...meta,
            notification: {
              description: intl.formatMessage(messages.priceListSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(msg, { value: status }),
              variant: AlertVariant.success,
            },
          })
        );
      })
      .catch(err => {
        let description = intl.formatMessage(messages.priceListErrorDesc);
        let title = intl.formatMessage(messages.priceListErrorTitle);

        if (priceListType === PriceListType.priceListRemove) {
          description = intl.formatMessage(messages.priceListRemoveErrorDesc);
          title = intl.formatMessage(messages.priceListRemoveErrorTitle);
        } else if (priceListType === PriceListType.priceListAdd) {
          description = intl.formatMessage(messages.priceListAddErrorDesc);
          title = intl.formatMessage(messages.priceListAddErrorTitle);
        }

        dispatch(
          updatePriceListFailure(err, {
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
