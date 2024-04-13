import { waitFor } from '@testing-library/react';

import * as awsOcpReports from './awsOcpReports';
import * as awsReports from './awsReports';
import * as azureOcpReports from './azureOcpReports';
import * as azureReports from './azureReports';
import * as gcpOcpReports from './gcpOcpReports';
import * as gcpReports from './gcpReports';
import * as ibmReports from './ibmReports';
import * as ociReports from './ociReports';
import * as ocpCloudReports from './ocpCloudReports';
import * as ocpReports from './ocpReports';
import { ReportType } from './report';
import * as rhelReports from './rhelReports';

jest.spyOn(awsReports, 'runReport');
jest.spyOn(awsOcpReports, 'runReport');
jest.spyOn(azureReports, 'runReport');
jest.spyOn(azureOcpReports, 'runReport');
jest.spyOn(gcpReports, 'runReport');
jest.spyOn(gcpOcpReports, 'runReport');
jest.spyOn(ibmReports, 'runReport');
jest.spyOn(ociReports, 'runReport');
jest.spyOn(ocpCloudReports, 'runReport');
jest.spyOn(ocpReports, 'runReport');
jest.spyOn(rhelReports, 'runReport');

test('runReport API request for AWS', async () => {
  awsReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(awsReports.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP on AWS', async () => {
  awsOcpReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(awsOcpReports.runReport).toHaveBeenCalled());
});

test('runReport API request for Azure', async () => {
  azureReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(azureReports.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP on Azure', async () => {
  azureOcpReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(azureOcpReports.runReport).toHaveBeenCalled());
});

test('runReport API request for GCP', async () => {
  gcpReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(gcpReports.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP on GCP', async () => {
  gcpOcpReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(gcpOcpReports.runReport).toHaveBeenCalled());
});

test('runReport API request for IBM', async () => {
  ibmReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(ibmReports.runReport).toHaveBeenCalled());
});

test('runReport API request for OCI', async () => {
  ociReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(ociReports.runReport).toHaveBeenCalled());
});

test('runReport API request for all cloud filtered by OCP', async () => {
  ocpCloudReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(ocpCloudReports.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP', async () => {
  ocpReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(ocpReports.runReport).toHaveBeenCalled());
});

test('runReport API request for RHEL', async () => {
  rhelReports.runReport(ReportType.cost, '');
  await waitFor(() => expect(rhelReports.runReport).toHaveBeenCalled());
});
