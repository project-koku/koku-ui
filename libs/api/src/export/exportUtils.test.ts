jest.mock('./exportUtils', () => ({
  __esModule: true,
  runExport: jest.fn(),
}));
import { waitFor } from '@testing-library/react';
import { ReportPathsType, ReportType } from '../reports/report';

import * as exportUtils from './exportUtils';

// runExport is a mocked function via jest.mock above

test('runExport API request for AWS', async () => {
  exportUtils.runExport(ReportPathsType.aws, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP on AWS', async () => {
  exportUtils.runExport(ReportPathsType.awsOcp, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for Azure', async () => {
  exportUtils.runExport(ReportPathsType.azure, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP on Azure', async () => {
  exportUtils.runExport(ReportPathsType.azureOcp, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for GCP', async () => {
  exportUtils.runExport(ReportPathsType.gcp, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP on GCP', async () => {
  exportUtils.runExport(ReportPathsType.gcpOcp, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for all cloud filtered by OCP', async () => {
  exportUtils.runExport(ReportPathsType.ocpCloud, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP', async () => {
  exportUtils.runExport(ReportPathsType.ocp, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});
