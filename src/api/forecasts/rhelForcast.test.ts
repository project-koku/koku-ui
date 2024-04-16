import { axiosInstance } from 'api';

import { ForecastType } from './forecast';
import { runForecast } from './rhelForecast';

test('runForecast API request for RHEL', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('forecasts/openshift/costs/?');
});
