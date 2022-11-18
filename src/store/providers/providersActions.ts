import type { Providers } from 'api/providers';
import type { ProviderType } from 'api/providers';
import { fetchProviders as apiGetProviders } from 'api/providers';
import type { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './providersCommon';

interface ProvidersActionMeta {
  fetchId: string;
}

export const fetchProvidersRequest = createAction('providers/fetch/request')<ProvidersActionMeta>();
export const fetchProvidersSuccess = createAction('providers/fetch/success')<Providers, ProvidersActionMeta>();
export const fetchProvidersFailure = createAction('providers/fetch/failure')<AxiosError, ProvidersActionMeta>();

export function fetchProviders(reportType: ProviderType, reportQueryString: string) {
  return dispatch => {
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

export const clearProviderFailure = createAction('providers/clear/failure');
