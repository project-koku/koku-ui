import { axiosInstance } from 'api';

import { ForecastType } from './forecast';
import { runForecast } from './ociForecast';

test('runForecast API request for OCI', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('forecasts/oci/costs/?');
});
