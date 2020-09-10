import { fetchRateMetrics, Metrics } from 'api/metrics';
import { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'react-redux';
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

export const fetchMetrics = (source_type: string = '') => {
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
