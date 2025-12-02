import axiosInstance from '../api';

import { ForecastType } from './forecast';
import { runForecast } from './ocpCloudForecast';

test('runForecast API request for all cloud filtered by OCP', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/infrastructures/all/costs/?');
});
