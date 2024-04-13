import { waitFor } from '@testing-library/react';

import * as awsOcpTags from './awsOcpTags';
import * as awsTags from './awsTags';
import * as azureOcpTags from './azureOcpTags';
import * as azureTags from './azureTags';
import * as gcpOcpTags from './gcpOcpTags';
import * as gcpTags from './gcpTags';
import * as ibmTags from './ibmTags';
import * as ociTags from './ociTags';
import * as ocpCloudTags from './ocpCloudTags';
import * as ocpTags from './ocpTags';
import * as rhelTags from './rhelTags';
import { TagType } from './tag';

jest.spyOn(awsTags, 'runTag');
jest.spyOn(awsOcpTags, 'runTag');
jest.spyOn(azureTags, 'runTag');
jest.spyOn(azureOcpTags, 'runTag');
jest.spyOn(gcpTags, 'runTag');
jest.spyOn(gcpOcpTags, 'runTag');
jest.spyOn(ibmTags, 'runTag');
jest.spyOn(ociTags, 'runTag');
jest.spyOn(ocpCloudTags, 'runTag');
jest.spyOn(ocpTags, 'runTag');
jest.spyOn(rhelTags, 'runTag');

test('runTag API request for AWS', async () => {
  awsTags.runTag(TagType.tag, '');
  await waitFor(() => expect(awsTags.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP on AWS', async () => {
  awsOcpTags.runTag(TagType.tag, '');
  await waitFor(() => expect(awsOcpTags.runTag).toHaveBeenCalled());
});

test('runTag API request for Azure', async () => {
  azureTags.runTag(TagType.tag, '');
  await waitFor(() => expect(azureTags.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP on Azure', async () => {
  azureOcpTags.runTag(TagType.tag, '');
  await waitFor(() => expect(azureOcpTags.runTag).toHaveBeenCalled());
});

test('runTag API request for GCP', async () => {
  gcpTags.runTag(TagType.tag, '');
  await waitFor(() => expect(gcpTags.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP on GCP', async () => {
  gcpOcpTags.runTag(TagType.tag, '');
  await waitFor(() => expect(gcpOcpTags.runTag).toHaveBeenCalled());
});

test('runTag API request for IBM', async () => {
  ibmTags.runTag(TagType.tag, '');
  await waitFor(() => expect(ibmTags.runTag).toHaveBeenCalled());
});

test('runTag API request for OCI', async () => {
  ociTags.runTag(TagType.tag, '');
  await waitFor(() => expect(ociTags.runTag).toHaveBeenCalled());
});

test('runTag API request for all cloud filtered by OCP', async () => {
  ocpCloudTags.runTag(TagType.tag, '');
  await waitFor(() => expect(ocpCloudTags.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP', async () => {
  ocpTags.runTag(TagType.tag, '');
  await waitFor(() => expect(ocpTags.runTag).toHaveBeenCalled());
});

test('runTag API request for RHEL', async () => {
  rhelTags.runTag(TagType.tag, '');
  await waitFor(() => expect(rhelTags.runTag).toHaveBeenCalled());
});
