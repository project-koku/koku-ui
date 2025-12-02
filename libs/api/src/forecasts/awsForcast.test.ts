import axiosInstance from '../api';

import { runForecast } from './awsForecast';
import { ForecastType } from './forecast';

test('runForecast API request for AWS', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/aws/costs/?');
});
