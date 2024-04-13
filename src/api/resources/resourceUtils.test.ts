import { waitFor } from '@testing-library/react';
import { ReportType } from 'api/reports/report';

import { ResourcePathsType, ResourceType } from './resource';
import * as resourceUtils from './resourceUtils';

jest.spyOn(resourceUtils, 'runResource');

test('runResource API request for AWS', async () => {
  resourceUtils.runResource(ResourcePathsType.aws, ResourceType.account, ReportType.cost);
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP on AWS', async () => {
  resourceUtils.runResource(ResourcePathsType.awsOcp, ResourceType.account, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for Azure', async () => {
  resourceUtils.runResource(ResourcePathsType.azure, ResourceType.payerTenantId, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP on Azure', async () => {
  resourceUtils.runResource(ResourcePathsType.azureOcp, ResourceType.payerTenantId, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for GCP', async () => {
  resourceUtils.runResource(ResourcePathsType.gcp, ResourceType.account, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP on GCP', async () => {
  resourceUtils.runResource(ResourcePathsType.gcpOcp, ResourceType.project, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for IBM', async () => {
  resourceUtils.runResource(ResourcePathsType.ibm, ResourceType.project, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for OCI', async () => {
  resourceUtils.runResource(ResourcePathsType.oci, ResourceType.payerTenantId, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP', async () => {
  resourceUtils.runResource(ResourcePathsType.ocp, ResourceType.project, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('runResource API request for RHEL', async () => {
  resourceUtils.runResource(ResourcePathsType.rhel, ResourceType.project, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});
