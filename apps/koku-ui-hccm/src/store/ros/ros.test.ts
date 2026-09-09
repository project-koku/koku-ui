jest.mock('api/ros', () => {
  const actual = jest.requireActual('api/ros');
  return {
    __esModule: true,
    ...actual,
    fetchRos: jest.fn(),
  };
});

import { waitFor } from '@testing-library/react';
import type { RosData } from 'api/ros';
import { fetchRos, RosType } from 'api/ros';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';
import { resetState } from 'store/ui/uiActions';

import * as actions from './rosActions';
import { getFetchId, stateKey } from './rosCommon';
import { rosReducer } from './rosReducer';
import * as selectors from './rosSelectors';

const createRosStore = createMockStoreCreator({
  [stateKey]: rosReducer,
});

const fetchRosMock = fetchRos as jest.Mock;

const rosMock: RosData = {
  openapi: '3.0.0',
  info: {
    description: 'ROS OpenAPI',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0',
    },
    title: 'Resource Optimization',
    version: '1.0.0',
  },
  paths: {},
};

const missingSpecError = { response: { status: 404 } };
const transientError = { response: { status: 500 } };

fetchRosMock.mockReturnValue(Promise.resolve({ data: rosMock }));

test('default state', () => {
  const store = createRosStore();
  expect(selectors.selectRosState(store.getState())).toMatchSnapshot();
});

test('fetch ROS OpenAPI success marks ROS as available', async () => {
  const store = createRosStore();
  store.dispatch(actions.fetchRos(RosType.openApi));
  expect(fetchRosMock).toHaveBeenCalled();
  expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.inProgress);
  await waitFor(() =>
    expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectRos(finishedState, RosType.openApi, '')).toEqual(rosMock);
  expect(selectors.selectRosAvailable(finishedState, RosType.openApi, '')).toBe(true);
  expect(selectors.selectRosError(finishedState, RosType.openApi, '')).toBe(null);
});

test('missing OpenAPI spec marks ROS as unavailable', async () => {
  const store = createRosStore();
  fetchRosMock.mockReturnValueOnce(Promise.reject(missingSpecError));
  store.dispatch(actions.fetchRos(RosType.openApi));
  expect(fetchRosMock).toHaveBeenCalled();
  await waitFor(() =>
    expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectRos(finishedState, RosType.openApi, '')).toBeUndefined();
  expect(selectors.selectRosAvailable(finishedState, RosType.openApi, '')).toBe(false);
  expect(selectors.selectRosError(finishedState, RosType.openApi, '')).toBe(null);
});

test('transient OpenAPI errors do not mark ROS as unavailable', async () => {
  const store = createRosStore();
  fetchRosMock.mockReturnValueOnce(Promise.reject(transientError));
  store.dispatch(actions.fetchRos(RosType.openApi));
  await waitFor(() =>
    expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectRosAvailable(finishedState, RosType.openApi, '')).toBeUndefined();
  expect(selectors.selectRosError(finishedState, RosType.openApi, '')).toBe(transientError);
});

test('does not fetch ROS OpenAPI if the request is in progress', () => {
  const store = createRosStore();
  store.dispatch(actions.fetchRos(RosType.openApi));
  store.dispatch(actions.fetchRos(RosType.openApi));
  expect(fetchRosMock).toHaveBeenCalledTimes(1);
});

test('does not refetch ROS OpenAPI after a cached availability result', async () => {
  const store = createRosStore();
  store.dispatch(actions.fetchRos(RosType.openApi));
  await waitFor(() => expect(selectors.selectRosAvailable(store.getState(), RosType.openApi, '')).toBe(true));
  store.dispatch(actions.fetchRos(RosType.openApi));
  expect(fetchRosMock).toHaveBeenCalledTimes(1);

  const unavailableStore = createRosStore();
  fetchRosMock.mockReturnValueOnce(Promise.reject(missingSpecError));
  unavailableStore.dispatch(actions.fetchRos(RosType.openApi));
  await waitFor(() =>
    expect(selectors.selectRosAvailable(unavailableStore.getState(), RosType.openApi, '')).toBe(false)
  );
  unavailableStore.dispatch(actions.fetchRos(RosType.openApi));
  expect(fetchRosMock).toHaveBeenCalledTimes(2);
});

test('does not refetch ROS OpenAPI after a transient error', async () => {
  const store = createRosStore();
  fetchRosMock.mockReturnValueOnce(Promise.reject(transientError));
  store.dispatch(actions.fetchRos(RosType.openApi));
  await waitFor(() =>
    expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
  );
  store.dispatch(actions.fetchRos(RosType.openApi));
  expect(fetchRosMock).toHaveBeenCalledTimes(1);
});

test('selectors resolve the same fetch id for undefined and empty query strings', async () => {
  const store = createRosStore();
  store.dispatch(actions.fetchRos(RosType.openApi));
  await waitFor(() =>
    expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
  );
  const state = store.getState();
  expect(selectors.selectRos(state, RosType.openApi, undefined as unknown as string)).toEqual(rosMock);
  expect(selectors.selectRosAvailable(state, RosType.openApi, undefined as unknown as string)).toBe(true);
  expect(getFetchId(RosType.openApi, '')).toBe(RosType.openApi);
  expect(getFetchId(RosType.openApi, undefined as unknown as string)).toBe(RosType.openApi);
  expect(getFetchId(RosType.openApi, 'limit=1')).toBe(`${RosType.openApi}--limit=1`);
});

test('resetState returns the default ROS slice', async () => {
  const store = createRosStore();
  store.dispatch(actions.fetchRos(RosType.openApi));
  await waitFor(() =>
    expect(selectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
  );
  store.dispatch(resetState());
  expect(selectors.selectRosState(store.getState())).toEqual({
    available: new Map(),
    byId: new Map(),
    errors: new Map(),
    fetchStatus: new Map(),
  });
});
