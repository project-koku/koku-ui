import { waitFor } from '@testing-library/react';

import * as awsOcpResource from './awsOcpResource';
import * as awsResource from './awsResource';
import * as azureOcpResource from './azureOcpResource';
import * as azureResource from './azureResource';
import * as gcpOcpResource from './gcpOcpResource';
import * as gcpResource from './gcpResource';
import * as ibmResource from './ibmResource';
import * as ociResource from './ociResource';
import * as ocpResource from './ocpResource';
import { ResourceType } from './resource';
import * as rhelResource from './rhelResource';

jest.spyOn(awsResource, 'runResource');
jest.spyOn(awsOcpResource, 'runResource');
jest.spyOn(azureResource, 'runResource');
jest.spyOn(azureOcpResource, 'runResource');
jest.spyOn(gcpResource, 'runResource');
jest.spyOn(gcpOcpResource, 'runResource');
jest.spyOn(ibmResource, 'runResource');
jest.spyOn(ociResource, 'runResource');
jest.spyOn(ocpResource, 'runResource');
jest.spyOn(rhelResource, 'runResource');

test('runResource API request for AWS', async () => {
  awsResource.runResource(ResourceType.account, '');
  await waitFor(() => expect(awsResource.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP on AWS', async () => {
  awsOcpResource.runResource(ResourceType.account, '');
  await waitFor(() => expect(awsOcpResource.runResource).toHaveBeenCalled());
});

test('runResource API request for Azure', async () => {
  azureResource.runResource(ResourceType.payerTenantId, '');
  await waitFor(() => expect(azureResource.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP on Azure', async () => {
  azureOcpResource.runResource(ResourceType.payerTenantId, '');
  await waitFor(() => expect(azureOcpResource.runResource).toHaveBeenCalled());
});

test('runResource API request for GCP', async () => {
  gcpResource.runResource(ResourceType.account, '');
  await waitFor(() => expect(gcpResource.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP on GCP', async () => {
  gcpOcpResource.runResource(ResourceType.project, '');
  await waitFor(() => expect(gcpOcpResource.runResource).toHaveBeenCalled());
});

test('runResource API request for IBM', async () => {
  ibmResource.runResource(ResourceType.project, '');
  await waitFor(() => expect(ibmResource.runResource).toHaveBeenCalled());
});

test('runResource API request for OCI', async () => {
  ociResource.runResource(ResourceType.payerTenantId, '');
  await waitFor(() => expect(ociResource.runResource).toHaveBeenCalled());
});

test('runResource API request for OCP', async () => {
  ocpResource.runResource(ResourceType.project, '');
  await waitFor(() => expect(ocpResource.runResource).toHaveBeenCalled());
});

test('runResource API request for RHEL', async () => {
  rhelResource.runResource(ResourceType.project, '');
  await waitFor(() => expect(rhelResource.runResource).toHaveBeenCalled());
});
