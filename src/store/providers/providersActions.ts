import type { Providers } from 'api/providers';
import type { ProviderType } from 'api/providers';
import { fetchProviders as apiGetProviders } from 'api/providers';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import type { RootState } from '../rootReducer';
import { getFetchId } from './providersCommon';
import { selectProviders, selectProvidersError, selectProvidersFetchStatus } from './providersSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ProvidersActionMeta {
  fetchId: string;
}

export const fetchProvidersRequest = createAction('providers/fetch/request')<ProvidersActionMeta>();
export const fetchProvidersSuccess = createAction('providers/fetch/success')<Providers, ProvidersActionMeta>();
export const fetchProvidersFailure = createAction('providers/fetch/failure')<AxiosError, ProvidersActionMeta>();

export function fetchProviders(reportType: ProviderType, reportQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, reportQueryString)) {
      return;
    }

    const meta: ProvidersActionMeta = {
      fetchId: getFetchId(reportType, reportQueryString),
    };

    dispatch(fetchProvidersRequest(meta));

    return apiGetProviders(reportQueryString)
      .then(res => {
        dispatch(fetchProvidersSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchProvidersFailure(err, meta));
      });
  };
}

function isReportExpired(state: RootState, reportType: ProviderType, reportQueryString: string) {
  const providers = selectProviders(state, reportType, reportQueryString);
  const fetchError = selectProvidersError(state, reportType, reportQueryString);
  const fetchStatus = selectProvidersFetchStatus(state, reportType, reportQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!providers) {
    return true;
  }

  const now = Date.now();
  return now > providers.timeRequested + expirationMS;
}

export const clearProviderFailure = createAction('providers/clear/failure');
