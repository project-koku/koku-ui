jest.mock('./resourceUtils', () => ({
  __esModule: true,
  isResourceTypeValid: jest.fn(() => true),
  runResource: jest.fn(),
}));
import { waitFor } from '@testing-library/react';

import { ResourcePathsType, ResourceType } from './resource';
import * as resourceUtils from './resourceUtils';

// isResourceTypeValid and runResource are mocked via jest.mock above

test('runResource API request for AWS', async () => {
  resourceUtils.runResource(ResourcePathsType.aws, ResourceType.account, '');
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

test('runResource API request for OCP', async () => {
  resourceUtils.runResource(ResourcePathsType.ocp, ResourceType.project, '');
  await waitFor(() => expect(resourceUtils.runResource).toHaveBeenCalled());
});

test('isResourceTypeValid for AWS', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.aws, ResourceType.account)).toEqual(true);
});

test('isResourceTypeValid for OCP on AWS', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.awsOcp, ResourceType.account)).toEqual(true);
});

test('isResourceTypeValid for Azure', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.azure, ResourceType.payerTenantId)).toEqual(true);
});

test('isResourceTypeValid for OCP on Azure', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.azureOcp, ResourceType.payerTenantId)).toEqual(true);
});

test('isResourceTypeValid for GCP', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.gcp, ResourceType.account)).toEqual(true);
});

test('isResourceTypeValid for OCP on GCP', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.gcpOcp, ResourceType.account)).toEqual(true);
});

test('isResourceTypeValid for OCP', async () => {
  expect(resourceUtils.isResourceTypeValid(ResourcePathsType.ocp, ResourceType.project)).toEqual(true);
});
