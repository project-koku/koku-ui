jest.mock('@koku-ui/api/userAccess');

import { waitFor } from '@testing-library/react';
import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { fetchUserAccess, UserAccessType } from '@koku-ui/api/userAccess';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './userAccessActions';
import { awsUserAccessQuery, stateKey } from './userAccessCommon';
import { userAccessReducer } from './userAccessReducer';
import * as selectors from './userAccessSelectors';

const createProdvidersStore = createMockStoreCreator({
  [stateKey]: userAccessReducer,
});

const fetchUserAccessMock = fetchUserAccess as jest.Mock;

const userAccessMock: UserAccess = {
  data: [
    {
      access: true,
      type: UserAccessType.aws,
    },
  ],
} as any;

fetchUserAccessMock.mockReturnValue(Promise.resolve({ data: userAccessMock }));

test('default state', async () => {
  const store = createProdvidersStore();
  expect(selectors.selectUserAccessState(store.getState())).toMatchSnapshot();
});

test('fetch userAccess success', async () => {
  const userAccessQueryString = getUserAccessQuery(awsUserAccessQuery);
  const store = createProdvidersStore();
  store.dispatch(actions.fetchUserAccess(UserAccessType.aws, userAccessQueryString));
  expect(fetchUserAccessMock).toHaveBeenCalled();
  expect(selectors.selectUserAccessFetchStatus(store.getState(), UserAccessType.aws, userAccessQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectUserAccessFetchStatus(store.getState(), UserAccessType.aws, userAccessQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectUserAccessFetchStatus(finishedState, UserAccessType.aws, userAccessQueryString)).toBe(
    FetchStatus.complete
  );
});

test('fetch userAccess failure', async () => {
  const userAccessQueryString = getUserAccessQuery(awsUserAccessQuery);
  const store = createProdvidersStore();
  const error = Symbol('getUserAccess error');
  fetchUserAccessMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.fetchUserAccess(UserAccessType.aws, userAccessQueryString));
  expect(fetchUserAccessMock).toHaveBeenCalled();
  expect(selectors.selectUserAccessFetchStatus(store.getState(), UserAccessType.aws, userAccessQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectUserAccessFetchStatus(store.getState(), UserAccessType.aws, userAccessQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectUserAccessFetchStatus(finishedState, UserAccessType.aws, userAccessQueryString)).toBe(
    FetchStatus.complete
  );
});
