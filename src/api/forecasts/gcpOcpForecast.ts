import axios from 'axios';

import { Forecast, ForecastType } from './forecast';

export const ForecastTypePaths: Partial<Record<ForecastType, string>> = {
  [ForecastType.cost]: 'forecasts/gcp/costs/',
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
