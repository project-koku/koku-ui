import { axiosInstance } from 'api';
import { ForecastType } from './forecast';
import { runForecast as runOcpCloudForecast } from './ocpCloudForecast';
import { runForecast as runOcpForecast } from './ocpForecast';

describe('forecast endpoints', () => {
  test('runOcpForecast uses the openshift costs path', () => {
    runOcpForecast(ForecastType.cost, 'limit=1');
    expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/costs/?limit=1');
  });

  test('runOcpCloudForecast uses the infrastructure path', () => {
    runOcpCloudForecast(ForecastType.cost, 'limit=1');
    expect(axiosInstance.get).toHaveBeenCalledWith('forecasts/openshift/infrastructures/all/costs/?limit=1');
  });
});
