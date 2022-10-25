import { runForecast as runAwsForecast } from './awsForecast';
import { runForecast as runAwsOcpForecast } from './awsOcpForecast';
import { runForecast as runAzureForecast } from './azureForecast';
import { runForecast as runAzureOcpForecast } from './azureOcpForecast';
import type { ForecastType } from './forecast';
import { ForecastPathsType } from './forecast';
import { runForecast as runGcpForecast } from './gcpForecast';
import { runForecast as runGcpOcpForecast } from './gcpOcpForecast';
import { runForecast as runIbmForecast } from './ibmForecast';
import { runForecast as runOciForecast } from './ociForecast';
import { runForecast as runOcpCloudForecast } from './ocpCloudForecast';
import { runForecast as runOcpForecast } from './ocpForecast';

export function runForecast(forecastPathsType: ForecastPathsType, forecastType: ForecastType, query: string) {
  let forecast;
  switch (forecastPathsType) {
    case ForecastPathsType.aws:
      forecast = runAwsForecast(forecastType, query);
      break;
    case ForecastPathsType.awsOcp:
      forecast = runAwsOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.azure:
      forecast = runAzureForecast(forecastType, query);
      break;
    case ForecastPathsType.azureOcp:
      forecast = runAzureOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.gcp:
      forecast = runGcpForecast(forecastType, query);
      break;
    case ForecastPathsType.gcpOcp:
      forecast = runGcpOcpForecast(forecastType, query);
      break;
    case ForecastPathsType.ibm:
      forecast = runIbmForecast(forecastType, query);
      break;
    case ForecastPathsType.oci:
      forecast = runOciForecast(forecastType, query);
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
