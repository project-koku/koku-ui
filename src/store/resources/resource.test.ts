jest.mock('api/resources/resourceUtils');

import { waitFor } from '@testing-library/react';
import type { Resource } from 'api/resources/resource';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import { runResource } from 'api/resources/resourceUtils';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './resourceActions';
import { resourceStateKey } from './resourceCommon';
import { resourceReducer } from './resourceReducer';
import * as selectors from './resourceSelectors';

const createResourcesStore = createMockStoreCreator({
  [resourceStateKey]: resourceReducer,
});

const runResourceMock = runResource as jest.Mock;

const mockResource: Resource = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const query = 'query';
const resourceType = ResourceType.account;
const resourcePathsType = ResourcePathsType.aws;

runResourceMock.mockResolvedValue({ data: mockResource });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'fetchResource');
jest.spyOn(selectors, 'selectResourceFetchStatus');

test('default state', () => {
  const store = createResourcesStore();
  expect(selectors.selectResourceState(store.getState())).toMatchSnapshot();
});

test('fetch resource success', async () => {
  const store = createResourcesStore();
  store.dispatch(actions.fetchResource(resourcePathsType, resourceType, query));
  expect(runResourceMock).toBeCalled();
  expect(selectors.selectResourceFetchStatus(store.getState(), resourcePathsType, resourceType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectResourceFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectResourceFetchStatus(finishedState, resourcePathsType, resourceType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectResourceError(finishedState, resourcePathsType, resourceType, query)).toBe(null);
});

test('fetch resource failure', async () => {
  const store = createResourcesStore();
  const error = Symbol('resource error');
  runResourceMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchResource(resourcePathsType, resourceType, query));
  expect(runResource).toBeCalled();
  expect(selectors.selectResourceFetchStatus(store.getState(), resourcePathsType, resourceType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectResourceFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectResourceFetchStatus(finishedState, resourcePathsType, resourceType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectResourceError(finishedState, resourcePathsType, resourceType, query)).toBe(error);
});

test('does not fetch resource if the request is in progress', () => {
  const store = createResourcesStore();
  store.dispatch(actions.fetchResource(resourcePathsType, resourceType, query));
  store.dispatch(actions.fetchResource(resourcePathsType, resourceType, query));
  expect(runResource).toHaveBeenCalledTimes(1);
});

test('resource is not refetched if it has not expired', async () => {
  const store = createResourcesStore();
  store.dispatch(actions.fetchResource(resourcePathsType, resourceType, query));
  await waitFor(() => expect(actions.fetchResource).toHaveBeenCalled());
  store.dispatch(actions.fetchResource(resourcePathsType, resourceType, query));
  expect(runResource).toHaveBeenCalledTimes(1);
});
