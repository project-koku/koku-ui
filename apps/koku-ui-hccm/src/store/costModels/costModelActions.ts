import { AlertVariant } from '@patternfly/react-core';
import type { CostModel, CostModelRequest, CostModels } from 'api/costModels';
import {
  addCostModel as apiAddCostModel,
  deleteCostModel as apiDeleteCostModel,
  fetchCostModels as apiGetCostModels,
  updateCostModel as apiUpdateCostModel,
} from 'api/costModels';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosResponse } from 'axios';
import type { AxiosError } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { Dispatch } from 'redux';
import { routes } from 'routes';
import type { ThunkAction } from 'store/common';
import { createAction } from 'typesafe-actions';
import { formatPath } from 'utils/paths';
import type { RouteComponentProps } from 'utils/router';

interface DialogPayload {
  isOpen: boolean;
  name: string;
  meta?: any;
}

interface FilterQuery {
  currentFilterType?: string;
  currentFilterValue?: string;
}

interface CostModelsActionMeta {
  notification?: any;
}

export const selectCostModel = createAction('costModels/select')<CostModel>();
export const setCostModelDialog = createAction('costModels/dialog/display')<DialogPayload>();
export const updateFilterToolbar = createAction('costModels/filter/fetch')<FilterQuery>();

// Reset notification and status

export const resetCostModel = createAction('costModels/reset')<void>();
export const resetErrors = createAction('costModels/errors/reset')<void>();
export const resetNotifications = createAction('costModels/notifications/reset')();
export const resetStatus = createAction('costModels/status/reset')();

// Add cost model

export const addCostModelsRequest = createAction('costModels/add/request')<void>();
export const addCostModelsSuccess = createAction('costModels/add/success')<
  AxiosResponse<CostModel>,
  CostModelsActionMeta
>();
export const addCostModelsFailure = createAction('costModels/add/failure')<AxiosError, CostModelsActionMeta>();

export const addCostModel = (request: CostModelRequest): any => {
  return (dispatch: Dispatch) => {
    dispatch(deleteCostModelsRequest());

    return apiAddCostModel(request)
      .then((res: any) => {
        dispatch(
          addCostModelsSuccess(res, {
            notification: {
              description: intl.formatMessage(messages.costModelsSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsSuccess, { value: 'add' }),
              variant: AlertVariant.success,
            },
          })
        );
        dispatch(resetCostModel());
        // fetchCostModels()(dispatch);
      })
      .catch(err => {
        dispatch(
          addCostModelsFailure(err, {
            notification: {
              description: intl.formatMessage(messages.costModelsErrorDesc, { value: 'add' }),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsErrorTitle, { value: 'add' }),
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
};

// Delete cost model

export const deleteCostModelsRequest = createAction('costModels/delete/request')<void>();
export const deleteCostModelsSuccess = createAction('costModels/delete/success')<void, CostModelsActionMeta>();
export const deleteCostModelsFailure = createAction('costModels/delete/failure')<AxiosError, CostModelsActionMeta>();

export const deleteCostModel = (uuid: string, dialog: string = null, router: RouteComponentProps = null): any => {
  return (dispatch: Dispatch) => {
    dispatch(deleteCostModelsRequest());

    return apiDeleteCostModel(uuid)
      .then(() => {
        dispatch(
          deleteCostModelsSuccess(undefined, {
            notification: {
              description: intl.formatMessage(messages.costModelsSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsSuccess, { value: 'remove' }),
              variant: AlertVariant.success,
            },
          })
        );
        dispatch(resetCostModel());
        if (dialog !== null) {
          fetchCostModels()(dispatch);
          if (dialog === 'deleteCostModel' && router) {
            router.navigate(formatPath(routes.settings.path));
          }
          dispatch(setCostModelDialog({ name: dialog, isOpen: false }));
        }
      })
      .catch(err => {
        dispatch(
          deleteCostModelsFailure(err, {
            notification: {
              description: intl.formatMessage(messages.costModelsErrorDesc, { value: 'remove' }),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsErrorTitle, { value: 'remove' }),
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
};

// Fetch cost models

export const fetchCostModelsRequest = createAction('costModels/fetch/request')<void>();
export const fetchCostModelsSuccess = createAction('costModels/fetch/success')<AxiosResponse<CostModels>>();
export const fetchCostModelsFailure = createAction('costModels/fetch/failure')<AxiosError>();

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

// Update cost model

export const updateCostModelsRequest = createAction('costModels/update/request')<void>();
export const updateCostModelsSuccess = createAction('costModels/update/success')<
  AxiosResponse<CostModel>,
  CostModelsActionMeta
>();
export const updateCostModelsFailure = createAction('update/costModels/failure')<AxiosError, CostModelsActionMeta>();

export const updateCostModel = (uuid: string, request: CostModelRequest, dialog: string = null): any => {
  return (dispatch: Dispatch) => {
    dispatch(updateCostModelsRequest());

    return apiUpdateCostModel(uuid, request)
      .then((res: any) => {
        dispatch(
          updateCostModelsSuccess(res, {
            notification: {
              description: intl.formatMessage(messages.costModelsSuccessChanges),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsSuccess, { value: 'update' }),
              variant: AlertVariant.success,
            },
          })
        );
        if (dialog !== null) {
          fetchCostModels(getQuery({ uuid } as Query))(dispatch);
          dispatch(setCostModelDialog({ name: dialog, isOpen: false }));
        }
      })
      .catch(err => {
        dispatch(
          updateCostModelsFailure(err, {
            notification: {
              description: intl.formatMessage(messages.costModelsErrorDesc, { value: 'update' }),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsErrorTitle, { value: 'update' }),
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
};

// Redirect to cost model from source uuid

export const redirectRequest = createAction('costModels/redirect/request')<void>();
export const redirectSuccess = createAction('costModels/redirect/success')<void>();
export const redirectFailure = createAction('costModels/redirect/failure')<AxiosError, CostModelsActionMeta>();

export const redirectToCostModelFromSourceUuid = (source_uuid: string, router: RouteComponentProps): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(redirectRequest());

    return apiGetCostModels(`source_uuid=${source_uuid}`)
      .then(res => {
        const uuid = res.data.data[0].uuid;
        router.navigate(`${formatPath(routes.costModelBreakdown.basePath)}/${uuid}`);
        dispatch(redirectSuccess());
      })
      .catch(err => {
        dispatch(
          redirectFailure(err, {
            notification: {
              description: intl.formatMessage(messages.costModelsRouterServerError),
              dismissable: true,
              title: intl.formatMessage(messages.costModelsRouterErrorTitle),
              variant: AlertVariant.danger,
            },
          })
        );
      });
  };
};
