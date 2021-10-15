import { CostType, fetchCostType as apiGetCostType } from 'api/costType';
import { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import { getReportId } from './costTypeCommon';

interface CostTypeActionMeta {
  reportId: string;
}

export const fetchCostTypeRequest = createAction('costType/fetch/request')<CostTypeActionMeta>();
export const fetchCostTypeSuccess = createAction('costType/fetch/success')<CostType, CostTypeActionMeta>();
export const fetchCostTypeFailure = createAction('costType/fetch/failure')<AxiosError, CostTypeActionMeta>();

export function fetchCostType() {
  return dispatch => {
    const meta: CostTypeActionMeta = {
      reportId: getReportId(),
    };

    dispatch(fetchCostTypeRequest(meta));

    return apiGetCostType()
      .then(res => {
        dispatch(fetchCostTypeSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchCostTypeFailure(err, meta));
      });
  };
}
