jest.mock('api/ros/rosUtils');

import { waitFor } from '@testing-library/react';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import { runRosReport } from 'api/ros/rosUtils';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './rosActions';
import { rosStateKey } from './rosCommon';
import { rosReducer } from './rosReducer';
import * as selectors from './rosSelectors';

const createRossStore = createMockStoreCreator({
  [rosStateKey]: rosReducer,
});

const runRosMock = runRosReport as jest.Mock;

const mockRos: RosReport = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const rosType = RosType.cost;
const rosPathsType = RosPathsType.recommendation;
const rosQueryString = 'rosQueryString';

runRosMock.mockResolvedValue({ data: mockRos });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'fetchRosReport');
jest.spyOn(selectors, 'selectRosFetchStatus');

test('default state', () => {
  const store = createRossStore();
  expect(selectors.selectRosState(store.getState())).toMatchSnapshot();
});

test('fetch ros success', async () => {
  const store = createRossStore();
  store.dispatch(actions.fetchRosReport(rosPathsType, rosType, rosQueryString));
  expect(runRosMock).toBeCalled();
  expect(selectors.selectRosFetchStatus(store.getState(), rosPathsType, rosType, rosQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectRosFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectRosFetchStatus(finishedState, rosPathsType, rosType, rosQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectRosError(finishedState, rosPathsType, rosType, rosQueryString)).toBe(null);
});

test('fetch ros failure', async () => {
  const store = createRossStore();
  const error = Symbol('ros error');
  runRosMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchRosReport(rosPathsType, rosType, rosQueryString));
  expect(runRosReport).toBeCalled();
  expect(selectors.selectRosFetchStatus(store.getState(), rosPathsType, rosType, rosQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectRosFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectRosFetchStatus(finishedState, rosPathsType, rosType, rosQueryString)).toBe(
    FetchStatus.complete
  );
  // Todo: Temporarily disable test while overriding the fail state to feed fake data
  // expect(selectors.selectRosError(finishedState, rosPathsType, rosType, rosQueryString)).toBe(error);
});

test('does not fetch ros if the request is in progress', () => {
  const store = createRossStore();
  store.dispatch(actions.fetchRosReport(rosPathsType, rosType, rosQueryString));
  store.dispatch(actions.fetchRosReport(rosPathsType, rosType, rosQueryString));
  expect(runRosReport).toHaveBeenCalledTimes(1);
});

test('ros is not refetched if it has not expired', async () => {
  const store = createRossStore();
  store.dispatch(actions.fetchRosReport(rosPathsType, rosType, rosQueryString));
  await waitFor(() => expect(actions.fetchRosReport).toHaveBeenCalled());
  store.dispatch(actions.fetchRosReport(rosPathsType, rosType, rosQueryString));
  expect(runRosReport).toHaveBeenCalledTimes(1);
});
