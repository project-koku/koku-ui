import axiosInstance from '../api';

import { ForecastType } from './forecast';
import { runForecast } from './ocpForecast';

test('runForecast API request for OCP', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/costs/?');
});
