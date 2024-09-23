import { addNotification } from '@ausuliv/frontend-components-notifications/redux';
import { AlertVariant } from '@patternfly/react-core';
import type { CostModel, CostModelRequest, CostModels } from 'api/costModels';
import {
  deleteCostModel as apiDeleteCostModel,
  fetchCostModels as apiGetCostModels,
  updateCostModel as apiUpdateCostModel,
} from 'api/costModels';
import type { AxiosResponse } from 'axios';
import type { AxiosError } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { Dispatch } from 'redux';
import { routes } from 'routes';
import type { ThunkAction } from 'store/common';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { formatPath } from 'utils/paths';
import type { RouteComponentProps } from 'utils/router';

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

export const fetchCostModels = (queryString: string = ''): any => {
  return (dispatch: Dispatch) => {
    dispatch(fetchCostModelsRequest());

    return apiGetCostModels(queryString)
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

export const deleteCostModel = (uuid: string, dialog: string = '', router: RouteComponentProps = null): any => {
  return (dispatch: Dispatch) => {
    dispatch(deleteCostModelsRequest());

    return apiDeleteCostModel(uuid)
      .then(() => {
        dispatch(deleteCostModelsSuccess());
        dispatch(resetCostModel());
        fetchCostModels()(dispatch);
        if (dialog !== null) {
          if (dialog === 'deleteCostModel' && router) {
            router.navigate(formatPath(routes.settings.path));
          }
          dispatch(setCostModelDialog({ name: dialog, isOpen: false }));
        }
      })
      .catch(err => {
        dispatch(deleteCostModelsFailure(err));
      });
  };
};

export const redirectToCostModelFromSourceUuid = (source_uuid: string, router: RouteComponentProps): ThunkAction => {
  return (dispatch: Dispatch) => {
    return apiGetCostModels(`source_uuid=${source_uuid}`)
      .then(res => {
        const uuid = res.data.data[0].uuid;
        router.navigate(`${formatPath(routes.costModel.basePath)}/${uuid}`);
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
