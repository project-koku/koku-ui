import axiosInstance from '../api';

import { runForecast } from './azureOcpForecast';
import { ForecastType } from './forecast';

test('runForecast API request for OCP on Azure', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/infrastructures/azure/costs/?');
});
