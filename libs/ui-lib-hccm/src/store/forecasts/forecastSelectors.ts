import type { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';

import type { RootState } from '../rootReducer';
import { forecastStateKey, getFetchId } from './forecastCommon';

export const selectForecastState = (state: RootState) => state[forecastStateKey];

export const selectForecast = (
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  forecastQueryString: string
) => selectForecastState(state).byId.get(getFetchId(forecastPathsType, forecastType, forecastQueryString));

export const selectForecastFetchStatus = (
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  forecastQueryString: string
) => selectForecastState(state).fetchStatus.get(getFetchId(forecastPathsType, forecastType, forecastQueryString));

export const selectForecastError = (
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  forecastQueryString: string
) => selectForecastState(state).errors.get(getFetchId(forecastPathsType, forecastType, forecastQueryString));
