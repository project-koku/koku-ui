import { runForecast as runAwsForecast } from './awsForecast';
import { ForecastPathsType, ForecastType } from './forecast';
import { runForecast as runOcpForecast } from './ocpForecast';

export function runForecast(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  let forecast;
  switch (forecastPathsType) {
    case ForecastPathsType.aws:
      forecast = runAwsForecast(forecastType, query);
      break;
    // case ForecastPathsType.azure:
    //   forecast = runAzureForecast(forecastType, query);
    //   break;
    case ForecastPathsType.ocp:
      forecast = runOcpForecast(forecastType, query);
      break;
  }
  return forecast;
}
