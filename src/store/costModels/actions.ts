import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import {
  CostModel,
  CostModelRequest,
  CostModels,
  deleteCostModel as apiDeleteCostModel,
  fetchCostModels as apiGetCostModels,
  updateCostModel as apiUpdateCostModel,
} from 'api/costModels';
import { AxiosError, AxiosResponse } from 'axios';
import { intl } from 'components/i18n';
import * as H from 'history';
import messages from 'locales/messages';
import { Dispatch } from 'redux';
import { ThunkAction } from 'store/common';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface FilterQuery {
  currentFilterType?: string;
  currentFilterValue?: string;
}

export const updateFilterToolbar = createAction('fetch/costModels/filter')<FilterQuery>();

export const selectCostModel = createAction('select/costModels')<CostModel>();

export const resetCostModel = createAction('reset/costModels')<void>();

interface DialogPayload {
  isOpen: boolean;
  name: string;
  meta?: any;
}

export const setCostModelDialog = createAction('display/costModels/dialog')<DialogPayload>();

export const {
  request: fetchCostModelsRequest,
  success: fetchCostModelsSuccess,
  failure: fetchCostModelsFailure,
} = createAsyncAction('fetch/costModels/request', 'fetch/costModels/success', 'fetch/costModels/failure')<
  void,
  AxiosResponse<CostModels>,
  AxiosError
>();

export const fetchCostModels = (query: string = ''): any => {
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

export const {
  request: updateCostModelsRequest,
  success: updateCostModelsSuccess,
  failure: updateCostModelsFailure,
} = createAsyncAction('update/costModels/request', 'update/costModels/success', 'update/costModels/failure')<
  void,
  AxiosResponse<CostModel>,
  AxiosError
>();

export const updateCostModel = (uuid: string, request: CostModelRequest, dialog: string = null): any => {
  return (dispatch: Dispatch) => {
    dispatch(updateCostModelsRequest());

    return apiUpdateCostModel(uuid, request)
      .then((res: any) => {
        dispatch(updateCostModelsSuccess(res));
        if (dialog !== null) {
          fetchCostModels(`uuid=${uuid}`)(dispatch);
          dispatch(setCostModelDialog({ name: dialog, isOpen: false }));
        }
      })
      .catch(err => {
        dispatch(updateCostModelsFailure(err));
      });
  };
};

export const {
  request: deleteCostModelsRequest,
  success: deleteCostModelsSuccess,
  failure: deleteCostModelsFailure,
} = createAsyncAction('delete/costModels/request', 'delete/costModels/success', 'delete/costModels/failure')<
  void,
  void,
  AxiosError
>();

export const deleteCostModel = (uuid: string, dialog: string = '', history: H.History = null): any => {
  return (dispatch: Dispatch) => {
    dispatch(deleteCostModelsRequest());

    return apiDeleteCostModel(uuid)
      .then(() => {
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
      .catch(err => {
        dispatch(deleteCostModelsFailure(err));
      });
  };
};

export const redirectToCostModelFromSourceUuid = (source_uuid: string, history: H.History): ThunkAction => {
  return (dispatch: Dispatch) => {
    return apiGetCostModels(`source_uuid=${source_uuid}`)
      .then(res => {
        const uuid = res.data.data[0].uuid;
        history.push(`/cost-models/${uuid}`);
      })
      .catch(() => {
        dispatch(
          addNotification({
            title: intl.formatMessage(messages.costModelsRouterErrorTitle),
            description: intl.formatMessage(messages.costModelsRouterServerError),
            variant: AlertVariant.danger,
            dismissable: true,
          })
        );
      });
  };
};
