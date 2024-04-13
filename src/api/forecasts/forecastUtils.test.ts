import { waitFor } from '@testing-library/react';

import * as awsForecast from './awsForecast';
import * as awsOcpForecast from './awsOcpForecast';
import * as azureForecast from './azureForecast';
import * as azureOcpForecast from './azureOcpForecast';
import { ForecastType } from './forecast';
import * as gcpForecast from './gcpForecast';
import * as gcpOcpForecast from './gcpOcpForecast';
import * as ibmForecast from './ibmForecast';
import * as ociForecast from './ociForecast';
import * as ocpCloudForecast from './ocpCloudForecast';
import * as ocpForecast from './ocpForecast';
import * as rhelForecast from './rhelForecast';

jest.spyOn(awsForecast, 'runForecast');
jest.spyOn(awsOcpForecast, 'runForecast');
jest.spyOn(azureForecast, 'runForecast');
jest.spyOn(azureOcpForecast, 'runForecast');
jest.spyOn(gcpForecast, 'runForecast');
jest.spyOn(gcpOcpForecast, 'runForecast');
jest.spyOn(ibmForecast, 'runForecast');
jest.spyOn(ociForecast, 'runForecast');
jest.spyOn(ocpCloudForecast, 'runForecast');
jest.spyOn(ocpForecast, 'runForecast');
jest.spyOn(rhelForecast, 'runForecast');

test('runForecast API request for AWS', async () => {
  awsForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(awsForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP on AWS', async () => {
  awsOcpForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(awsOcpForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for Azure', async () => {
  azureForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(azureForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP on Azure', async () => {
  azureOcpForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(azureOcpForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for GCP', async () => {
  gcpForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(gcpForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP on GCP', async () => {
  gcpOcpForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(gcpOcpForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for IBM', async () => {
  ibmForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(ibmForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCI', async () => {
  ociForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(ociForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for all cloud filtered by OCP', async () => {
  ocpCloudForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(ocpCloudForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for OCP', async () => {
  ocpForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(ocpForecast.runForecast).toHaveBeenCalled());
});

test('runForecast API request for RHEL', async () => {
  rhelForecast.runForecast(ForecastType.cost, '');
  await waitFor(() => expect(rhelForecast.runForecast).toHaveBeenCalled());
});
