import type { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';

export const forecastStateKey = 'forecast';

export function getFetchId(
  forecastPathsType: ForecastPathsType,
  forecastType: ForecastType,
  forecastQueryString: string
) {
  return `${forecastPathsType}--${forecastType}--${forecastQueryString}`;
}
