import type { CostModel, CostModels } from '@koku-ui/api/costModels';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import {
  deleteCostModelsFailure,
  deleteCostModelsRequest,
  deleteCostModelsSuccess,
  fetchCostModelsFailure,
  fetchCostModelsRequest,
  fetchCostModelsSuccess,
  redirectFailure,
  redirectRequest,
  redirectSuccess,
  resetCostModel,
  selectCostModel,
  setCostModelDialog,
  updateCostModelsFailure,
  updateCostModelsRequest,
  updateCostModelsSuccess,
  updateFilterToolbar,
} from './actions';

export const stateKey = 'costModels';

export type CostModelsState = Readonly<{
  costModels: CostModels;
  error: AxiosError;
  status: FetchStatus;
  currentFilterType: string;
  currentFilterValue: string;
  isDialogOpen: {
    addSource: boolean;
    deleteSource: boolean;
    deleteRate: boolean;
    addRate: boolean;
    updateRate: boolean;
    updateCostModel: boolean;
    deleteCostModel: boolean;
    deleteMarkup: boolean;
    updateMarkup: boolean;
    deleteDistribution: boolean;
    updateDistribution: boolean;
    createWizard: boolean;
  };
  dialogData: any;
  update: {
    error: AxiosError;
    status: FetchStatus;
    current: CostModel;
  };
  delete: {
    error: AxiosError;
    status: FetchStatus;
  };
  redirect: {
    error: AxiosError;
    notification?: any;
    status: FetchStatus;
  };
}>;

export const defaultState: CostModelsState = {
  costModels: null,
  error: null,
  status: FetchStatus.none,
  currentFilterType: 'name',
  currentFilterValue: '',
  isDialogOpen: {
    deleteRate: false,
    deleteSource: false,
    addSource: false,
    addRate: false,
    updateRate: false,
    deleteCostModel: false,
    updateCostModel: false,
    deleteMarkup: false,
    updateMarkup: false,
    deleteDistribution: false,
    updateDistribution: false,
    createWizard: false,
  },
  dialogData: null,
  update: {
    error: null,
    status: FetchStatus.none,
    current: null,
  },
  delete: {
    error: null,
    status: FetchStatus.none,
  },
  redirect: {
    error: null,
    notification: null,
    status: FetchStatus.none,
  },
};

export type CostModelsAction = ActionType<
  | typeof updateCostModelsFailure
  | typeof updateCostModelsRequest
  | typeof updateCostModelsSuccess
  | typeof deleteCostModelsFailure
  | typeof deleteCostModelsRequest
  | typeof deleteCostModelsSuccess
  | typeof fetchCostModelsFailure
  | typeof fetchCostModelsRequest
  | typeof fetchCostModelsSuccess
  | typeof redirectFailure
  | typeof redirectRequest
  | typeof redirectSuccess
  | typeof resetCostModel
  | typeof setCostModelDialog
  | typeof selectCostModel
  | typeof updateFilterToolbar
>;

export const reducer = (state: CostModelsState = defaultState, action: CostModelsAction): CostModelsState => {
  switch (action.type) {
    case getType(resetCostModel):
      return {
        ...state,
        update: {
          ...state.update,
          current: null,
        },
      };
    case getType(selectCostModel):
      return {
        ...state,
        update: {
          ...state.update,
          current: action.payload,
        },
      };
    case getType(updateCostModelsRequest):
      return {
        ...state,
        update: {
          ...state.update,
          status: FetchStatus.inProgress,
        },
      };
    case getType(updateCostModelsSuccess):
      return {
        ...state,
        update: {
          error: null,
          status: FetchStatus.complete,
          current: action.payload.data,
        },
      };
    case getType(updateCostModelsFailure):
      return {
        ...state,
        update: {
          ...state.update,
          status: FetchStatus.complete,
          error: action.payload,
        },
      };
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
        error: action.payload,
        status: FetchStatus.complete,
      };
    case getType(deleteCostModelsRequest):
      return {
        ...state,
        delete: {
          ...state.delete,
          status: FetchStatus.inProgress,
        },
      };
    case getType(deleteCostModelsSuccess):
      return {
        ...state,
        delete: {
          error: null,
          status: FetchStatus.complete,
        },
      };
    case getType(deleteCostModelsFailure):
      return {
        ...state,
        delete: {
          status: FetchStatus.complete,
          error: action.payload,
        },
      };

    case getType(updateFilterToolbar):
      return {
        ...state,
        ...action.payload,
      };
    case getType(setCostModelDialog):
      return {
        ...state,
        isDialogOpen: {
          ...state.isDialogOpen,
          [action.payload.name]: action.payload.isOpen,
        },
        dialogData: action.payload.meta,
      };
    case getType(redirectFailure):
      return {
        ...state,
        redirect: {
          error: action.payload,
          notification: action.meta.notification,
          status: FetchStatus.complete,
        },
      };
    case getType(redirectRequest):
      return {
        ...state,
        redirect: {
          error: null,
          notification: null,
          status: FetchStatus.inProgress,
        },
      };
    case getType(redirectSuccess):
      return {
        ...state,
        redirect: {
          error: null,
          notification: null,
          status: FetchStatus.complete,
        },
      };
    default:
      return state;
  }
};
