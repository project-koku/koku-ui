jest.mock('api/users');

import { getCurrentUser, User } from 'api/users';
import { wait } from 'testUtils';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';
import * as actions from './usersActions';
import { stateKey, usersReducer } from './usersReducer';
import * as selectors from './usersSelectors';

const createUsersStore = createMockStoreCreator({
  [stateKey]: usersReducer,
});

const getCurrentUserMock = getCurrentUser as jest.Mock;

const currentUserMock: User = {
  uuid: 'currentUser',
  username: 'currentUser',
  email: 'currentUser@test.test',
};

getCurrentUserMock.mockReturnValue(Promise.resolve({ data: currentUserMock }));

test('default state', async () => {
  const store = createUsersStore();
  expect(selectors.selectUsersState(store.getState())).toMatchSnapshot();
});

test('fetch current user success', async () => {
  const store = createUsersStore();
  store.dispatch(actions.getCurrentUser());
  expect(getCurrentUserMock).toBeCalled();
  expect(selectors.selectCurrentUserFetchStatus(store.getState())).toBe(
    FetchStatus.inProgress
  );
  await wait();
  const finishedState = store.getState();
  expect(selectors.selectCurrentUser(finishedState)).toBe(currentUserMock);
  expect(selectors.selectCurrentUserFetchStatus(finishedState)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectCurrentUserError(finishedState)).toBe(null);
});

test('fetch current user failure', async () => {
  const store = createUsersStore();
  const error = Symbol('getCurrentUser error');
  getCurrentUserMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.getCurrentUser());
  expect(getCurrentUserMock).toBeCalled();
  expect(selectors.selectCurrentUserFetchStatus(store.getState())).toBe(
    FetchStatus.inProgress
  );
  await wait();
  const finishedState = store.getState();
  expect(selectors.selectCurrentUserFetchStatus(finishedState)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectCurrentUserError(finishedState)).toBe(error);
});
