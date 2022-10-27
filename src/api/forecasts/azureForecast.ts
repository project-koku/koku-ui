import axios from 'axios';

import type { Forecast } from './forecast';
import { ForecastType } from './forecast';

export const ForecastTypePaths: Partial<Record<ForecastType, string>> = {
  [ForecastType.cost]: 'forecasts/azure/costs/',
};

export function runForecast(forecastType: ForecastType, query: string) {
  const insights = (window as any).insights;
  const path = ForecastTypePaths[forecastType];
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Forecast>(`${path}?${query}`);
    });
  } else {
    return axios.get<Forecast>(`${path}?${query}`);
  }
}
