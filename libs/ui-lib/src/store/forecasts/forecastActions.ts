import type { Forecast } from '@koku-ui/api/forecasts/forecast';
import type { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';
import { runForecast } from '@koku-ui/api/forecasts/forecastUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

import { FetchStatus } from '../common';
import type { RootState } from '../rootReducer';
import { getFetchId } from './forecastCommon';
import { selectForecast, selectForecastError, selectForecastFetchStatus } from './forecastSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ForecastActionMeta {
  fetchId: string;
}

export const fetchForecastRequest = createAction('forecast/request')<ForecastActionMeta>();
export const fetchForecastSuccess = createAction('forecast/success')<Forecast, ForecastActionMeta>();
export const fetchForecastFailure = createAction('forecast/failure')<AxiosError, ForecastActionMeta>();

export function fetchForecast(
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  forecastQueryString: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isForecastExpired(getState(), forecastPathsType, forecastType, forecastQueryString)) {
      return;
    }

    const meta: ForecastActionMeta = {
      fetchId: getFetchId(forecastPathsType, forecastType, forecastQueryString),
    };

    dispatch(fetchForecastRequest(meta));
    runForecast(forecastPathsType, forecastType, forecastQueryString)
      .then(res => {
        dispatch(fetchForecastSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchForecastFailure(err, meta));
      });
  };
}

function isForecastExpired(
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  forecastQueryString: string
) {
  const forecast = selectForecast(state, forecastPathsType, forecastType, forecastQueryString);
  const fetchError = selectForecastError(state, forecastPathsType, forecastType, forecastQueryString);
  const fetchStatus = selectForecastFetchStatus(state, forecastPathsType, forecastType, forecastQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!forecast) {
    return true;
  }

  const now = Date.now();
  return now > forecast.timeRequested + expirationMS;
}
