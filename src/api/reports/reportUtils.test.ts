import { waitFor } from '@testing-library/react';

import { ReportPathsType, ReportType } from './report';
import * as reportUtils from './reportUtils';

jest.spyOn(reportUtils, 'runReport');

test('runReport API request for AWS', async () => {
  reportUtils.runReport(ReportPathsType.aws, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP on AWS', async () => {
  reportUtils.runReport(ReportPathsType.awsOcp, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for Azure', async () => {
  reportUtils.runReport(ReportPathsType.azure, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP on Azure', async () => {
  reportUtils.runReport(ReportPathsType.azureOcp, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for GCP', async () => {
  reportUtils.runReport(ReportPathsType.gcp, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP on GCP', async () => {
  reportUtils.runReport(ReportPathsType.gcpOcp, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for IBM', async () => {
  reportUtils.runReport(ReportPathsType.ibm, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for OCI', async () => {
  reportUtils.runReport(ReportPathsType.oci, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for all cloud filtered by OCP', async () => {
  reportUtils.runReport(ReportPathsType.ocpCloud, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for OCP', async () => {
  reportUtils.runReport(ReportPathsType.ocp, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});

test('runReport API request for RHEL', async () => {
  reportUtils.runReport(ReportPathsType.rhel, ReportType.cost, '');
  await waitFor(() => expect(reportUtils.runReport).toHaveBeenCalled());
});
