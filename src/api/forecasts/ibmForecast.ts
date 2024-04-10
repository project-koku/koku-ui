import { axiosInstance } from 'api';

import type { Forecast } from './forecast';
import { ForecastType } from './forecast';

export const ForecastTypePaths: Partial<Record<ForecastType, string>> = {
  [ForecastType.cost]: 'forecasts/gcp/costs/', // Todo: update to use ibm APIs are available
};

export function runForecast(forecastType: ForecastType, query: string) {
  const path = ForecastTypePaths[forecastType];
  return axiosInstance.get<Forecast>(`${path}?${query}`);
}
