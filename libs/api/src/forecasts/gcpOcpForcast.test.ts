import axiosInstance from '../api';

import { ForecastType } from './forecast';
import { runForecast } from './gcpOcpForecast';

test('runForecast API request for OCP on GCP', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/infrastructures/gcp/costs/?');
});
