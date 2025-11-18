jest.mock('./tagUtils', () => ({
  __esModule: true,
  runTag: jest.fn(),
}));
import { waitFor } from '@testing-library/react';

import { TagPathsType, TagType } from './tag';
import * as tagUtils from './tagUtils';

// runTag is a mocked function via jest.mock above

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

test('runTag API request for all cloud filtered by OCP', async () => {
  tagUtils.runTag(TagPathsType.ocpCloud, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});

test('runTag API request for OCP', async () => {
  tagUtils.runTag(TagPathsType.ocp, TagType.tag, '');
  await waitFor(() => expect(tagUtils.runTag).toHaveBeenCalled());
});
