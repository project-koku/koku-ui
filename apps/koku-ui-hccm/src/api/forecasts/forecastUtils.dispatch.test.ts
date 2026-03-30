jest.mock('./awsForecast', () => ({ runForecast: jest.fn(() => 'aws') }));
jest.mock('./awsOcpForecast', () => ({ runForecast: jest.fn(() => 'awsOcp') }));
jest.mock('./azureForecast', () => ({ runForecast: jest.fn(() => 'azure') }));
jest.mock('./azureOcpForecast', () => ({ runForecast: jest.fn(() => 'azureOcp') }));
jest.mock('./gcpForecast', () => ({ runForecast: jest.fn(() => 'gcp') }));
jest.mock('./gcpOcpForecast', () => ({ runForecast: jest.fn(() => 'gcpOcp') }));
jest.mock('./ocpCloudForecast', () => ({ runForecast: jest.fn(() => 'ocpCloud') }));
jest.mock('./ocpForecast', () => ({ runForecast: jest.fn(() => 'ocp') }));

import { ForecastPathsType, ForecastType } from './forecast';
import { runForecast } from './forecastUtils';

const q = '?limit=1';

describe('runForecast dispatches to provider module', () => {
  it.each([
    [ForecastPathsType.aws, 'aws'],
    [ForecastPathsType.awsOcp, 'awsOcp'],
    [ForecastPathsType.azure, 'azure'],
    [ForecastPathsType.azureOcp, 'azureOcp'],
    [ForecastPathsType.gcp, 'gcp'],
    [ForecastPathsType.gcpOcp, 'gcpOcp'],
    [ForecastPathsType.ocp, 'ocp'],
    [ForecastPathsType.ocpCloud, 'ocpCloud'],
  ] as const)('uses %s runner', (pathsType, expected) => {
    expect(runForecast(pathsType, ForecastType.cost, q)).toBe(expected);
  });
});
