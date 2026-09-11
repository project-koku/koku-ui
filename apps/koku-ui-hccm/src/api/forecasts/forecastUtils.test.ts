import { ForecastPathsType, ForecastType } from './forecast';
import { runForecast } from './forecastUtils';

jest.mock('./awsForecast', () => ({ runForecast: jest.fn(() => 'aws') }));
jest.mock('./awsOcpForecast', () => ({ runForecast: jest.fn(() => 'awsOcp') }));
jest.mock('./azureForecast', () => ({ runForecast: jest.fn(() => 'azure') }));
jest.mock('./azureOcpForecast', () => ({ runForecast: jest.fn(() => 'azureOcp') }));
jest.mock('./gcpForecast', () => ({ runForecast: jest.fn(() => 'gcp') }));
jest.mock('./gcpOcpForecast', () => ({ runForecast: jest.fn(() => 'gcpOcp') }));
jest.mock('./ocpForecast', () => ({ runForecast: jest.fn(() => 'ocp') }));
jest.mock('./ocpCloudForecast', () => ({ runForecast: jest.fn(() => 'ocpCloud') }));

import { runForecast as runAwsForecast } from './awsForecast';
import { runForecast as runAwsOcpForecast } from './awsOcpForecast';
import { runForecast as runAzureForecast } from './azureForecast';
import { runForecast as runAzureOcpForecast } from './azureOcpForecast';
import { runForecast as runGcpForecast } from './gcpForecast';
import { runForecast as runGcpOcpForecast } from './gcpOcpForecast';
import { runForecast as runOcpCloudForecast } from './ocpCloudForecast';
import { runForecast as runOcpForecast } from './ocpForecast';

describe('runForecast', () => {
  const query = 'filter[resolution]=daily';

  test.each([
    [ForecastPathsType.aws, runAwsForecast, 'aws'],
    [ForecastPathsType.awsOcp, runAwsOcpForecast, 'awsOcp'],
    [ForecastPathsType.azure, runAzureForecast, 'azure'],
    [ForecastPathsType.azureOcp, runAzureOcpForecast, 'azureOcp'],
    [ForecastPathsType.gcp, runGcpForecast, 'gcp'],
    [ForecastPathsType.gcpOcp, runGcpOcpForecast, 'gcpOcp'],
    [ForecastPathsType.ocp, runOcpForecast, 'ocp'],
    [ForecastPathsType.ocpCloud, runOcpCloudForecast, 'ocpCloud'],
  ] as const)('dispatches %s forecasts', (pathType, fn, result) => {
    expect(runForecast(pathType, ForecastType.cost, query)).toBe(result);
    expect(fn).toHaveBeenCalledWith(ForecastType.cost, query);
  });

  test('returns undefined for unknown path types', () => {
    expect(runForecast('unknown' as ForecastPathsType, ForecastType.cost, query)).toBeUndefined();
  });
});
