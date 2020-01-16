import { addProvider as apiCreateProvider } from 'api/providers';
import { fetchProviders as apiGetProviders } from 'api/providers';
import {
  Provider,
  ProviderRequest,
  Providers,
  ProviderType,
} from 'api/providers';
import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { uiActions } from 'store/ui';
import { createAction, createStandardAction } from 'typesafe-actions';
import { addProviderKey, getReportId } from './providersCommon';

interface ProvidersActionMeta {
  reportId: string;
}

export const addProviderRequest = createStandardAction('providers/add/request')<
  ProvidersActionMeta
>();
export const addProviderSuccess = createStandardAction('providers/add/success')<
  Provider,
  ProvidersActionMeta
>();
export const addProviderFailure = createStandardAction('providers/add/failure')<
  AxiosError,
  ProvidersActionMeta
>();

export const fetchProvidersRequest = createStandardAction(
  'providers/fetch/request'
)<ProvidersActionMeta>();
export const fetchProvidersSuccess = createStandardAction(
  'providers/fetch/success'
)<Providers, ProvidersActionMeta>();
export const fetchProvidersFailure = createStandardAction(
  'providers/fetch/failure'
)<AxiosError, ProvidersActionMeta>();

export function addProvider(request: ProviderRequest) {
  return (dispatch: Dispatch) => {
    const meta: ProvidersActionMeta = {
      reportId: addProviderKey,
    };

    dispatch(addProviderRequest(meta));

    return apiCreateProvider(request)
      .then(res => {
        dispatch(addProviderSuccess(res.data, meta));
        dispatch(uiActions.closeProvidersModal());
      })
      .catch(err => {
        dispatch(addProviderFailure(err, meta));
      });
  };
}

export function fetchProviders(reportType: ProviderType, query: string) {
  return (dispatch, getState) => {
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
