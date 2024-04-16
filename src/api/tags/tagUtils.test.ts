import { waitFor } from '@testing-library/react';

import { TagPathsType, TagType } from './tag';
import * as tagUtils from './tagUtils';

jest.spyOn(tagUtils, 'runTag');

test('runTag API request for AWS', async () => {
  tagUtils.runTag(TagPathsType.aws, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP on AWS', async () => {
  tagUtils.runTag(TagPathsType.awsOcp, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for Azure', async () => {
  tagUtils.runTag(TagPathsType.azure, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP on Azure', async () => {
  tagUtils.runTag(TagPathsType.azureOcp, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for GCP', async () => {
  tagUtils.runTag(TagPathsType.gcp, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP on GCP', async () => {
  tagUtils.runTag(TagPathsType.gcpOcp, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for IBM', async () => {
  tagUtils.runTag(TagPathsType.ibm, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for OCI', async () => {
  tagUtils.runTag(TagPathsType.oci, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for all cloud filtered by OCP', async () => {
  tagUtils.runTag(TagPathsType.ocpCloud, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP', async () => {
  tagUtils.runTag(TagPathsType.ocp, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for RHEL', async () => {
  tagUtils.runTag(TagPathsType.rhel, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});
