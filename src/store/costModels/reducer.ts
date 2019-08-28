import { CostModels } from 'api/costModels';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchCostModelsFailure,
  fetchCostModelsRequest,
  fetchCostModelsSuccess,
  updateFilterToolbar,
} from './actions';

export const stateKey = 'costModels';

export type CostModelsState = Readonly<{
  costModels: CostModels;
  error: AxiosError;
  status: FetchStatus;
  currentFilterType: string;
  currentFilterValue: string;
}>;

export const defaultState: CostModelsState = {
  costModels: null,
  error: null,
  status: FetchStatus.none,
  currentFilterType: 'name',
  currentFilterValue: '',
};

export type CostModelsAction = ActionType<
  | typeof fetchCostModelsFailure
  | typeof fetchCostModelsRequest
  | typeof fetchCostModelsSuccess
  | typeof updateFilterToolbar
>;

export const reducer = (
  state: CostModelsState = defaultState,
  action: CostModelsAction
): CostModelsState => {
  switch (action.type) {
    case getType(fetchCostModelsRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(fetchCostModelsSuccess):
      return {
        ...state,
        currentFilterValue: '',
        status: FetchStatus.complete,
        error: null,
        costModels: action.payload.data,
      };
    case getType(fetchCostModelsFailure):
      return {
        ...state,
        status: FetchStatus.complete,
        error: action.payload,
      };
    case getType(updateFilterToolbar):
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
