import axiosInstance from '../api';

import { runForecast } from './awsOcpForecast';
import { ForecastType } from './forecast';

test('runForecast API request for OCP on AWS', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/infrastructures/aws/costs/?');
});
