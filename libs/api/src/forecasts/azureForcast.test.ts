import axiosInstance from '../api';

import { runForecast } from './azureForecast';
import { ForecastType } from './forecast';

test('runForecast API request for Azure', () => {
  runForecast(ForecastType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/azure/costs/?');
});
