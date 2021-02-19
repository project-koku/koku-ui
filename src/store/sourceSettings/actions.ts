import { fetchProviders as apiGetSources, Providers } from 'api/providers';
import { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { createAsyncAction, createStandardAction } from 'typesafe-actions';

interface FilterQuery {
  currentFilterType?: string;
  currentFilterValue?: string;
}

export const updateFilterToolbar = createStandardAction('fetch/source/filter')<FilterQuery>();

export const {
  request: fetchSourcesRequest,
  success: fetchSourcesSuccess,
  failure: fetchSourcesFailure,
} = createAsyncAction('fetch/source/request', 'fetch/source/success', 'fetch/source/failure')<
  void,
  AxiosResponse<Providers>,
  AxiosError
>();

export const fetchSources = (query: string = '') => {
  return (dispatch: Dispatch) => {
    dispatch(fetchSourcesRequest());

    return apiGetSources(query)
      .then(res => {
        dispatch(fetchSourcesSuccess(res));
      })
      .catch(err => {
        dispatch(fetchSourcesFailure(err));
      });
  };
};
