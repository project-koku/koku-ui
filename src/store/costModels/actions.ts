import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import {
  CostModel,
  CostModelRequest,
  CostModels,
  deleteCostModel as apiDeleteCostModel,
  fetchCostModels as apiGetCostModels,
  updateCostModel as apiUpdateCostModel,
} from 'api/costModels';
import { AxiosError, AxiosResponse } from 'axios';
import * as H from 'history';
import i18next from 'i18next';
import { Dispatch } from 'react-redux';
import { createAsyncAction, createStandardAction } from 'typesafe-actions';

interface FilterQuery {
  currentFilterType?: string;
  currentFilterValue?: string;
}

export const updateFilterToolbar = createStandardAction(
  'fetch/costModels/filter'
)<FilterQuery>();

export const selectCostModel = createStandardAction('select/costModels')<
  CostModel
>();

export const resetCostModel = createStandardAction('reset/costModels')<void>();

interface DialogPayload {
  isOpen: boolean;
  name: string;
}

export const setCostModelDialog = createStandardAction(
  'display/costModels/dialog'
)<DialogPayload>();

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
      .then((res) => {
        dispatch(fetchCostModelsSuccess(res));
      })
      .catch((err) => {
        dispatch(fetchCostModelsFailure(err));
      });
  };
};

export const {
  request: updateCostModelsRequest,
  success: updateCostModelsSuccess,
  failure: updateCostModelsFailure,
} = createAsyncAction(
  'update/costModels/request',
  'update/costModels/success',
  'update/costModels/failure'
)<void, AxiosResponse<CostModel>, AxiosError>();

export const updateCostModel = (
  uuid: string,
  request: CostModelRequest,
  dialog: string = null
) => {
  return (dispatch: Dispatch) => {
    dispatch(updateCostModelsRequest());

    return apiUpdateCostModel(uuid, request)
      .then((res) => {
        dispatch(updateCostModelsSuccess(res));
        if (dialog !== null) {
          fetchCostModels(`uuid=${uuid}`)(dispatch);
          dispatch(setCostModelDialog({ name: dialog, isOpen: false }));
        }
      })
      .catch((err) => {
        dispatch(updateCostModelsFailure(err));
      });
  };
};

export const {
  request: deleteCostModelsRequest,
  success: deleteCostModelsSuccess,
  failure: deleteCostModelsFailure,
} = createAsyncAction(
  'delete/costModels/request',
  'delete/costModels/success',
  'delete/costModels/failure'
)<void, void, AxiosError>();

export const deleteCostModel = (
  uuid: string,
  dialog: string = '',
  history: H.History = null
) => {
  return (dispatch: Dispatch) => {
    dispatch(deleteCostModelsRequest());

    return apiDeleteCostModel(uuid)
      .then((res) => {
        dispatch(deleteCostModelsSuccess());
        dispatch(resetCostModel());
        fetchCostModels()(dispatch);
        if (dialog !== null) {
          if (dialog === 'deleteCostModel' && history) {
            history.push('/cost-models');
          }
          dispatch(setCostModelDialog({ name: dialog, isOpen: false }));
        }
      })
      .catch((err) => {
        dispatch(deleteCostModelsFailure(err));
      });
  };
};

export const redirectToCostModelFromSourceUuid = (source_uuid: string, history: H.History) => {
  return (dispatch: Dispatch) => {
    return apiGetCostModels(`source_uuid=${source_uuid}`).then(res => {
      const uuid = res.data.data[0].uuid
      insights.chrome.appNavClick({id: 'cost-models', secondaryNav: null})
      history.push(`/cost-models/${uuid}`)
    }).catch(err => {
      dispatch(
        addNotification({
          title: i18next.t('cost_models_router.error_title'),
          description: i18next.t('cost_models_router.server_error'),
          variant: 'danger',
          dismissable: true,
        })
      )
    })
  }
}