import type { ForecastType } from './forecast';
import { ForecastPathsType } from './forecast';
import { runForecast as runOcpCloudForecast } from './ocpCloudForecast';
import { runForecast as runOcpForecast } from './ocpForecast';

export function runForecast(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  let result;
  switch (forecastPathsType) {
    case ForecastPathsType.ocp:
      result = runOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.ocpCloud:
      result = runOcpCloudForecast(forecastType, query);
      break;
  }
  return result;
}
