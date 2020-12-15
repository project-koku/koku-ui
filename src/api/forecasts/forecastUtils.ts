import { runForecast as runAwsForecast } from './awsForecast';
import { runForecast as runAzureForecast } from './azureForecast';
import { ForecastPathsType, ForecastType } from './forecast';
import { runForecast as runOcpCloudForecast } from './ocpCloudForecast';
import { runForecast as runOcpForecast } from './ocpForecast';

export function runForecast(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  let forecast;
  switch (forecastPathsType) {
    case ForecastPathsType.aws:
      forecast = runAwsForecast(forecastType, query);
      break;
    case ForecastPathsType.azure:
      forecast = runAzureForecast(forecastType, query);
      break;
    case ForecastPathsType.ocp:
      forecast = runOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.ocpCloud:
      forecast = runOcpCloudForecast(forecastType, query);
      break;
  }
  return forecast;
}
