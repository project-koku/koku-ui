import { runForecast as runAwsForecast } from './awsForecast';
import { runForecast as runAwsOcpForecast } from './awsOcpForecast';
import { runForecast as runAzureForecast } from './azureForecast';
import { runForecast as runAzureOcpForecast } from './azureOcpForecast';
import type { ForecastType } from './forecast';
import { ForecastPathsType } from './forecast';
import { runForecast as runGcpForecast } from './gcpForecast';
import { runForecast as runGcpOcpForecast } from './gcpOcpForecast';
import { runForecast as runOcpCloudForecast } from './ocpCloudForecast';
import { runForecast as runOcpForecast } from './ocpForecast';

export function runForecast(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  let result;
  switch (forecastPathsType) {
    case ForecastPathsType.aws:
      result = runAwsForecast(forecastType, query);
      break;
    case ForecastPathsType.awsOcp:
      result = runAwsOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.azure:
      result = runAzureForecast(forecastType, query);
      break;
    case ForecastPathsType.azureOcp:
      result = runAzureOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.gcp:
      result = runGcpForecast(forecastType, query);
      break;
    case ForecastPathsType.gcpOcp:
      result = runGcpOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.ocp:
      result = runOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.ocpCloud:
      result = runOcpCloudForecast(forecastType, query);
      break;
  }
  return result;
}
