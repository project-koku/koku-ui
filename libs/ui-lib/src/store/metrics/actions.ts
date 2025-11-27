import type { Metrics } from '@koku-ui/api/metrics';
import { fetchRateMetrics } from '@koku-ui/api/metrics';
import type { AxiosResponse } from 'axios';
import type { AxiosError } from 'axios';
import type { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchMetricsRequest,
  success: fetchMetricsSuccess,
  failure: fetchMetricsFailure,
} = createAsyncAction('fetch/metrics/request', 'fetch/metrics/success', 'fetch/metrics/failure')<
  void,
  AxiosResponse<Metrics>,
  AxiosError
>();

export const fetchMetrics = (source_type: string = ''): any => {
  return (dispatch: Dispatch) => {
    dispatch(fetchMetricsRequest());

    return fetchRateMetrics(source_type)
      .then(res => {
        dispatch(fetchMetricsSuccess(res));
      })
      .catch(err => {
        dispatch(fetchMetricsFailure(err));
      });
  };
};
