import {
  CostModels,
  fetchCostModels as apiGetCostModels,
} from 'api/costModels';
import { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'react-redux';
import { createAsyncAction, createStandardAction } from 'typesafe-actions';

interface FilterQuery {
  currentFilterType?: string;
  currentFilterValue?: string;
}

export const updateFilterToolbar = createStandardAction(
  'fetch/costModels/filter'
)<FilterQuery>();

export const {
  request: fetchCostModelsRequest,
  success: fetchCostModelsSuccess,
  failure: fetchCostModelsFailure,
} = createAsyncAction(
  'fetch/costModels/request',
  'fetch/costModels/success',
  'fetch/costModels/failure'
)<void, AxiosResponse<CostModels>, AxiosError>();

export const fetchCostModels = (query: string = '') => {
  return (dispatch: Dispatch) => {
    dispatch(fetchCostModelsRequest());

    return apiGetCostModels(query)
      .then(res => {
        dispatch(fetchCostModelsSuccess(res));
      })
      .catch(err => {
        dispatch(fetchCostModelsFailure(err));
      });
  };
};
