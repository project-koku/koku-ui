import { runForecast as runAwsForecast } from './awsForecast';
import { ForecastPathsType, ForecastType } from './forecast';

export function runForecast(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  let forecast;
  switch (forecastPathsType) {
    case ForecastPathsType.aws:
      forecast = runAwsForecast(forecastType, query);
      break;
  }
  return forecast;
}
