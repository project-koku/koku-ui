import axios from 'axios';

import { Forecast, ForecastType } from './forecast';

export const ForecastTypePaths: Partial<Record<ForecastType, string>> = {
  [ForecastType.cost]: 'forecasts/openshift/infrastructures/all/costs/',
};

export function runForecast(forecastType: ForecastType, query: string) {
  const path = ForecastTypePaths[forecastType];
  return axios.get<Forecast>(`${path}?${query}`);
}
