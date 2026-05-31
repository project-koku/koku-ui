import type { CostModel, CostModels } from 'api/costModels';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import {
  addCostModelsFailure,
  addCostModelsRequest,
  addCostModelsSuccess,
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
  resetErrors,
  resetNotifications,
  resetStatus,
  selectCostModel,
  setCostModelDialog,
  updateCostModelsFailure,
  updateCostModelsRequest,
  updateCostModelsSuccess,
  updateFilterToolbar,
} from './costModelActions';

export const stateKey = 'costModels';

export type CostModelsState = Readonly<{
  add: {
    current: CostModel;
    error: AxiosError;
    notification?: any;
    status: FetchStatus;
  };
  costModels: CostModels | null;
  currentFilterType: string;
  currentFilterValue: string;
  delete: {
    error: AxiosError;
    notification?: any;
    status: FetchStatus;
  };
  dialogData: any;
  fetch: {
    error: AxiosError;
    status: FetchStatus;
  };
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
  redirect: {
    error: AxiosError;
    notification?: any;
    status: FetchStatus;
  };
  update: {
    current: CostModel;
    error: AxiosError;
    notification?: any;
    status: FetchStatus;
  };
}>;

export const defaultState: CostModelsState = {
  add: {
    current: null,
    error: null,
    notification: null,
    status: FetchStatus.none,
  },
  costModels: null,
  currentFilterType: 'name',
  currentFilterValue: '',
  delete: {
    error: null,
    notification: null,
    status: FetchStatus.none,
  },
  dialogData: null,
  fetch: {
    error: null,
    status: FetchStatus.none,
  },
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
  redirect: {
    error: null,
    notification: null,
    status: FetchStatus.none,
  },
  update: {
    current: null,
    error: null,
    notification: null,
    status: FetchStatus.none,
  },
};

export type CostModelsAction = ActionType<
  | typeof addCostModelsFailure
  | typeof addCostModelsRequest
  | typeof addCostModelsSuccess
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
  | typeof resetErrors
  | typeof resetNotifications
  | typeof resetStatus
  | typeof setCostModelDialog
  | typeof selectCostModel
  | typeof updateCostModelsFailure
  | typeof updateCostModelsRequest
  | typeof updateCostModelsSuccess
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
    case getType(resetErrors):
      return {
        ...state,
        add: {
          ...state.add,
          error: null,
        },
        delete: {
          ...state.delete,
          error: null,
        },
        fetch: {
          ...state.fetch,
          error: null,
        },
        redirect: {
          ...state.redirect,
          error: null,
        },
        update: {
          ...state.update,
          error: null,
        },
      };
    case getType(resetNotifications):
      return {
        ...state,
        add: {
          ...state.add,
          notification: null,
        },
        delete: {
          ...state.delete,
          notification: null,
        },
        fetch: {
          ...state.fetch,
        },
        redirect: {
          ...state.redirect,
          notification: null,
        },
        update: {
          ...state.update,
          notification: null,
        },
      };
    case getType(resetStatus):
      return {
        ...state,
        add: {
          ...state.add,
          status: null,
        },
        delete: {
          ...state.delete,
          status: null,
        },
        fetch: {
          ...state.fetch,
          status: null,
        },
        redirect: {
          ...state.redirect,
          status: null,
        },
        update: {
          ...state.update,
          status: null,
        },
      };
    case getType(addCostModelsRequest):
      return {
        ...state,
        add: {
          ...state.update,
          status: FetchStatus.inProgress,
        },
      };
    case getType(addCostModelsSuccess):
      return {
        ...state,
        add: {
          current: action.payload.data,
          error: null,
          notification: action.meta?.notification,
          status: FetchStatus.complete,
        },
      };
    case getType(addCostModelsFailure):
      return {
        ...state,
        add: {
          ...state.update,
          error: action.payload,
          notification: action.meta?.notification,
          status: FetchStatus.complete,
        },
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
          notification: action.meta?.notification,
          status: FetchStatus.complete,
        },
      };
    case getType(deleteCostModelsFailure):
      return {
        ...state,
        delete: {
          error: action.payload,
          notification: action.meta?.notification,
          status: FetchStatus.complete,
        },
      };
    case getType(fetchCostModelsRequest):
      return {
        ...state,
        fetch: {
          error: null,
          status: FetchStatus.inProgress,
        },
      };
    case getType(fetchCostModelsSuccess):
      return {
        ...state,
        fetch: {
          error: null,
          status: FetchStatus.complete,
        },
        costModels: action.payload.data,
        currentFilterValue: '',
      };
    case getType(fetchCostModelsFailure):
      return {
        ...state,
        fetch: {
          error: action.payload,
          status: FetchStatus.complete,
        },
      };
    case getType(redirectFailure):
      return {
        ...state,
        redirect: {
          error: action.payload,
          notification: action.meta?.notification,
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
    case getType(selectCostModel):
      return {
        ...state,
        update: {
          ...state.update,
          current: action.payload,
        },
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
          current: action.payload.data,
          error: null,
          status: FetchStatus.complete,
          notification: action.meta?.notification,
        },
      };
    case getType(updateCostModelsFailure):
      return {
        ...state,
        update: {
          ...state.update,
          error: action.payload,
          notification: action.meta?.notification,
          status: FetchStatus.complete,
        },
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
