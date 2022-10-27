import type { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import type { RootState } from 'store/rootReducer';

import { forecastStateKey, getForecastId } from './forecastCommon';

export const selectForecastState = (state: RootState) => state[forecastStateKey];

export const selectForecast = (
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  query: string
) => selectForecastState(state).byId.get(getForecastId(forecastPathsType, forecastType, query));

export const selectForecastFetchStatus = (
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  query: string
) => selectForecastState(state).fetchStatus.get(getForecastId(forecastPathsType, forecastType, query));

export const selectForecastError = (
  state: RootState,
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  query: string
) => selectForecastState(state).errors.get(getForecastId(forecastPathsType, forecastType, query));
