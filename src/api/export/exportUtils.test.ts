import { waitFor } from '@testing-library/react';
import { ReportPathsType } from 'api/reports/report';

import * as awsExport from './awsExport';
import * as awsOcpExport from './awsOcpExport';
import * as azureExport from './azureExport';
import * as azureOcpExport from './azureOcpExport';
import * as gcpExport from './gcpExport';
import * as gcpOcpExport from './gcpOcpExport';
import * as ibmExport from './ibmExport';
import * as ociExport from './ociExport';
import * as ocpCloudExport from './ocpCloudExport';
import * as ocpExport from './ocpExport';
import * as rhelExport from './rhelExport';

jest.spyOn(awsExport, 'runExport');
jest.spyOn(awsOcpExport, 'runExport');
jest.spyOn(azureExport, 'runExport');
jest.spyOn(azureOcpExport, 'runExport');
jest.spyOn(gcpExport, 'runExport');
jest.spyOn(gcpOcpExport, 'runExport');
jest.spyOn(ibmExport, 'runExport');
jest.spyOn(ociExport, 'runExport');
jest.spyOn(ocpCloudExport, 'runExport');
jest.spyOn(ocpExport, 'runExport');
jest.spyOn(rhelExport, 'runExport');

test('runExport API request for AWS', async () => {
  awsExport.runExport(ReportPathsType.aws, '');
  await waitFor(() => expect(awsExport.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP on AWS', async () => {
  awsOcpExport.runExport(ReportPathsType.awsOcp, '');
  await waitFor(() => expect(awsOcpExport.runExport).toHaveBeenCalled());
});

test('runExport API request for Azure', async () => {
  azureExport.runExport(ReportPathsType.azure, '');
  await waitFor(() => expect(azureExport.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP on Azure', async () => {
  azureOcpExport.runExport(ReportPathsType.azureOcp, '');
  await waitFor(() => expect(azureOcpExport.runExport).toHaveBeenCalled());
});

test('runExport API request for GCP', async () => {
  gcpExport.runExport(ReportPathsType.gcp, '');
  await waitFor(() => expect(gcpExport.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP on GCP', async () => {
  gcpOcpExport.runExport(ReportPathsType.gcpOcp, '');
  await waitFor(() => expect(gcpOcpExport.runExport).toHaveBeenCalled());
});

test('runExport API request for IBM', async () => {
  ibmExport.runExport(ReportPathsType.ibm, '');
  await waitFor(() => expect(ibmExport.runExport).toHaveBeenCalled());
});

test('runExport API request for OCI', async () => {
  ociExport.runExport(ReportPathsType.oci, '');
  await waitFor(() => expect(ociExport.runExport).toHaveBeenCalled());
});

test('runExport API request for all cloud filtered by OCP', async () => {
  ocpCloudExport.runExport(ReportPathsType.ocpCloud, '');
  await waitFor(() => expect(ocpCloudExport.runExport).toHaveBeenCalled());
});

test('runExport API request for OCP', async () => {
  ocpExport.runExport(ReportPathsType.ocp, '');
  await waitFor(() => expect(ocpExport.runExport).toHaveBeenCalled());
});

test('runExport API request for RHEL', async () => {
  rhelExport.runExport(ReportPathsType.rhel, '');
  await waitFor(() => expect(rhelExport.runExport).toHaveBeenCalled());
});
