jest.mock('api/tags/tagUtils');

import { waitFor } from '@testing-library/react';
import type { Tag } from 'api/tags/tag';
import { TagPathsType, TagType } from 'api/tags/tag';
import { runTag } from 'api/tags/tagUtils';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

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

const tagReportType = TagType.tag;
const tagReportPathsType = TagPathsType.aws;
const tagQueryString = 'tagQueryString';

runTagMock.mockResolvedValue({ data: mockTagReport });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'fetchTag');
jest.spyOn(selectors, 'selectTagFetchStatus');

test('default state', () => {
  const store = createTagsStore();
  expect(selectors.selectTagState(store.getState())).toMatchSnapshot();
});

test('fetch tag report success', async () => {
  const store = createTagsStore();
  store.dispatch(actions.fetchTag(tagReportPathsType, tagReportType, tagQueryString));
  expect(runTagMock).toBeCalled();
  expect(selectors.selectTagFetchStatus(store.getState(), tagReportPathsType, tagReportType, tagQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectTagFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectTagFetchStatus(finishedState, tagReportPathsType, tagReportType, tagQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectTagError(finishedState, tagReportPathsType, tagReportType, tagQueryString)).toBe(null);
});

test('fetch tag report failure', async () => {
  const store = createTagsStore();
  const error = Symbol('tag error');
  runTagMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchTag(tagReportPathsType, tagReportType, tagQueryString));
  expect(runTag).toBeCalled();
  expect(selectors.selectTagFetchStatus(store.getState(), tagReportPathsType, tagReportType, tagQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectTagFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectTagFetchStatus(finishedState, tagReportPathsType, tagReportType, tagQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectTagError(finishedState, tagReportPathsType, tagReportType, tagQueryString)).toBe(error);
});

test('does not fetch tag report if the request is in progress', () => {
  const store = createTagsStore();
  store.dispatch(actions.fetchTag(tagReportPathsType, tagReportType, tagQueryString));
  store.dispatch(actions.fetchTag(tagReportPathsType, tagReportType, tagQueryString));
  expect(runTag).toHaveBeenCalledTimes(1);
});

test('tag report is not refetched if it has not expired', async () => {
  const store = createTagsStore();
  store.dispatch(actions.fetchTag(tagReportPathsType, tagReportType, tagQueryString));
  await waitFor(() => expect(actions.fetchTag).toHaveBeenCalled());
  store.dispatch(actions.fetchTag(tagReportPathsType, tagReportType, tagQueryString));
  expect(runTag).toHaveBeenCalledTimes(1);
});
