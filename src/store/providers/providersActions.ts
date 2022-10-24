import type { Providers } from 'api/providers';
import { fetchProviders as apiGetProviders } from 'api/providers';
import { ProviderType } from 'api/providers';
import { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import { getReportId } from './providersCommon';

interface ProvidersActionMeta {
  reportId: string;
}

export const fetchProvidersRequest = createAction('providers/fetch/request')<ProvidersActionMeta>();
export const fetchProvidersSuccess = createAction('providers/fetch/success')<Providers, ProvidersActionMeta>();
export const fetchProvidersFailure = createAction('providers/fetch/failure')<AxiosError, ProvidersActionMeta>();

export function fetchProviders(reportType: ProviderType, query: string) {
  return dispatch => {
    const meta: ProvidersActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchProvidersRequest(meta));

    return apiGetProviders(query)
      .then(res => {
        dispatch(fetchProvidersSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchProvidersFailure(err, meta));
      });
  };
}

export const clearProviderFailure = createAction('providers/clear/failure');
