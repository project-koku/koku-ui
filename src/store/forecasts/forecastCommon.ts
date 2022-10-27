import type { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';

export const forecastStateKey = 'forecast';

export function getForecastId(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  return `${forecastPathsType}--${forecastType}--${query}`;
}
