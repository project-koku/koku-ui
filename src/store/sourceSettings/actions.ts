import {
  deleteProvider as apiRemoveSource,
  fetchProviders as apiGetSources,
  Providers,
} from 'api/providers';
import { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'react-redux';
import { deleteDialogActions } from 'store/sourceDeleteDialog';
import { createAsyncAction, createStandardAction } from 'typesafe-actions';

interface FilterQuery {
  currentFilterType?: string;
  currentFilterValue?: string;
}

export const updateFilterToolbar = createStandardAction('fetch/source/filter')<
  FilterQuery
>();

export const {
  request: fetchSourcesRequest,
  success: fetchSourcesSuccess,
  failure: fetchSourcesFailure,
} = createAsyncAction(
  'fetch/source/request',
  'fetch/source/success',
  'fetch/source/failure'
)<void, AxiosResponse<Providers>, AxiosError>();

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

export const {
  request: removeSourceRequest,
  success: removeSourceSuccess,
  failure: removeSourceFailure,
} = createAsyncAction(
  'remove/source/request',
  'remove/source/success',
  'remove/source/failure'
)<void, void, AxiosError>();

export const removeSource = uuid => {
  return (dispatch: Dispatch) => {
    dispatch(removeSourceRequest());
    dispatch(deleteDialogActions.processing());

    return apiRemoveSource(uuid)
      .then(res => {
        fetchSources()(dispatch);
        dispatch(deleteDialogActions.closeModal());
      })
      .catch(err => {
        dispatch(removeSourceFailure(err));
        dispatch(deleteDialogActions.error(err));
      });
  };
};
