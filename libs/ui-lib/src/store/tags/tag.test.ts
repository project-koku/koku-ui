jest.mock('@koku-ui/api/tags/tagUtils');

import { waitFor } from '@testing-library/react';
import type { Tag } from '@koku-ui/api/tags/tag';
import { TagPathsType, TagType } from '@koku-ui/api/tags/tag';
import { runTag } from '@koku-ui/api/tags/tagUtils';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './tagActions';
import { tagStateKey } from './tagCommon';
import { tagReducer } from './tagReducer';
import * as selectors from './tagSelectors';

const createTagsStore = createMockStoreCreator({
  [tagStateKey]: tagReducer,
});

const runTagMock = runTag as jest.Mock;

const mockTagReport: Tag = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const tagType = TagType.tag;
const tagPathsType = TagPathsType.aws;
const tagQueryString = 'tagQueryString';

runTagMock.mockResolvedValue({ data: mockTagReport });
global.Date.now = jest.fn(() => 12345);

test('default state', () => {
  const store = createTagsStore();
  expect(selectors.selectTagState(store.getState())).toMatchSnapshot();
});

test('fetch tag report success', async () => {
  const store = createTagsStore();
  store.dispatch(actions.fetchTag(tagPathsType, tagType, tagQueryString));
  expect(runTagMock).toHaveBeenCalled();
  expect(selectors.selectTagFetchStatus(store.getState(), tagPathsType, tagType, tagQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectTagFetchStatus(store.getState(), tagPathsType, tagType, tagQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectTagFetchStatus(finishedState, tagPathsType, tagType, tagQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectTagError(finishedState, tagPathsType, tagType, tagQueryString)).toBe(null);
});

test('fetch tag report failure', async () => {
  const store = createTagsStore();
  const error = Symbol('tag error');
  runTagMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchTag(tagPathsType, tagType, tagQueryString));
  expect(runTag).toHaveBeenCalled();
  expect(selectors.selectTagFetchStatus(store.getState(), tagPathsType, tagType, tagQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectTagFetchStatus(store.getState(), tagPathsType, tagType, tagQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectTagFetchStatus(finishedState, tagPathsType, tagType, tagQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectTagError(finishedState, tagPathsType, tagType, tagQueryString)).toBe(error);
});

test('does not fetch tag report if the request is in progress', () => {
  const store = createTagsStore();
  store.dispatch(actions.fetchTag(tagPathsType, tagType, tagQueryString));
  store.dispatch(actions.fetchTag(tagPathsType, tagType, tagQueryString));
  expect(runTag).toHaveBeenCalledTimes(1);
});

test('tag report is not refetched if it has not expired', async () => {
  const store = createTagsStore();
  store.dispatch(actions.fetchTag(tagPathsType, tagType, tagQueryString));
  await waitFor(() =>
    expect(selectors.selectTagFetchStatus(store.getState(), tagPathsType, tagType, tagQueryString)).toBe(
      FetchStatus.complete
    )
  );
  store.dispatch(actions.fetchTag(tagPathsType, tagType, tagQueryString));
  expect(runTag).toHaveBeenCalledTimes(1);
});
