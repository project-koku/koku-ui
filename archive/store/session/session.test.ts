jest.mock('api/session');

import { login, LoginRequest, LoginResponse, logout } from 'api/session';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';
import { wait } from 'testUtils';
import * as actions from './sessionActions';
import { sessionReducer, stateKey } from './sessionReducer';
import * as selectors from './sessionSelectors';

const createSessionStore = createMockStoreCreator({
  [stateKey]: sessionReducer,
});

const loginMock = login as jest.Mock;
const logoutMock = logout as jest.Mock;
const loginRequest: LoginRequest = {
  username: 'username',
  password: 'password',
};
const loginResponseMock: LoginResponse = {
  token: 'token',
};
loginMock.mockReturnValue(Promise.resolve({ data: loginResponseMock }));

test('default state', async () => {
  const store = createSessionStore();
  expect(selectors.selectSessionState(store.getState())).toMatchSnapshot();
});

test('log in success', async () => {
  const store = createSessionStore();
  store.dispatch(actions.login(loginRequest));
  expect(loginMock).toBeCalledWith(loginRequest);
  expect(selectors.selectLoginFetchStatus(store.getState())).toBe(
    FetchStatus.inProgress
  );
  await wait();
  expect(selectors.selectLoginFetchStatus(store.getState())).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectIsLoggedIn(store.getState())).toBe(true);
  expect(selectors.selectLoginError(store.getState())).toBe(null);
});

test('log in failure', async () => {
  const store = createSessionStore();
  const error = 'error';
  loginMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.login(loginRequest));
  expect(selectors.selectLoginFetchStatus(store.getState())).toBe(
    FetchStatus.inProgress
  );
  await wait();
  expect(selectors.selectLoginFetchStatus(store.getState())).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectIsLoggedIn(store.getState())).toBe(false);
  expect(selectors.selectLoginError(store.getState())).toBe(error);
});

test('logout', async () => {
  const store = createSessionStore();
  store.dispatch(actions.login(loginRequest));
  await wait();
  store.dispatch(actions.logout());
  expect(logoutMock).toBeCalled();
  expect(selectors.selectSessionState(store.getState()));
});
