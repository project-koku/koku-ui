import { addProvider as apiCreateProvider } from 'api/providers';
import { getProviders as apiGetProviders } from 'api/providers';
import { Provider, ProviderRequest, Providers } from 'api/providers';
import { uiActions } from 'store/ui';

import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const {
  request: getProvidersRequest,
  success: getProvidersSuccess,
  failure: getProvidersFailure,
} = createAsyncAction(
  'providers/get/request',
  'providers/get/success',
  'providers/get/failure'
)<void, Providers, AxiosError>();

export const {
  request: addProviderRequest,
  success: addProviderSuccess,
  failure: addProviderFailure,
} = createAsyncAction(
  'providers/add/request',
  'providers/add/success',
  'providers/add/failure'
)<void, Provider, AxiosError>();

export function addProvider(request: ProviderRequest) {
  return (dispatch: Dispatch) => {
    dispatch(addProviderRequest());
    return apiCreateProvider(request)
      .then(response => {
        dispatch(addProviderSuccess(response.data));
        dispatch(uiActions.closeProvidersModal());
      })
      .catch(err => {
        dispatch(addProviderFailure(err));
      });
  };
}

export const getProviders = () => {
  return (dispatch: Dispatch) => {
    dispatch(getProvidersRequest());
    return apiGetProviders()
      .then(response => {
        dispatch(getProvidersSuccess(response.data));
      })
      .catch(err => {
        dispatch(getProvidersFailure(err));
      });
  };
};

export const clearProviderFailure = createAction('providers/clear/failure');

// Todo: delete providers?
