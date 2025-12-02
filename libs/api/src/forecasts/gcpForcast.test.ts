import axiosInstance from '../api';

import { ForecastType } from './forecast';
import { runForecast } from './gcpForecast';

test('runForecast API request for GCP', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/gcp/costs/?');
});
