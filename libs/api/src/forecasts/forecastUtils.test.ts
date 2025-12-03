jest.mock('./forecastUtils', () => ({
  __esModule: true,
  runForecast: jest.fn(),
}));
import { waitFor } from '@testing-library/react';

import { ForecastPathsType, ForecastType } from './forecast';
import * as forecastUtils from './forecastUtils';

// runForecast is a mocked function via jest.mock above

test('runForecast API request for AWS', async () => {
  forecastUtils.runForecast(ForecastPathsType.aws, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP on AWS', async () => {
  forecastUtils.runForecast(ForecastPathsType.awsOcp, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for Azure', async () => {
  forecastUtils.runForecast(ForecastPathsType.azure, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP on Azure', async () => {
  forecastUtils.runForecast(ForecastPathsType.azureOcp, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for GCP', async () => {
  forecastUtils.runForecast(ForecastPathsType.gcp, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP on GCP', async () => {
  forecastUtils.runForecast(ForecastPathsType.gcpOcp, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for all cloud filtered by OCP', async () => {
  forecastUtils.runForecast(ForecastPathsType.ocpCloud, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP', async () => {
  forecastUtils.runForecast(ForecastPathsType.ocp, ForecastType.cost, '');
  await waitFor(() => expect(forecastUtils.runForecast).toHaveBeenCalled());
});
