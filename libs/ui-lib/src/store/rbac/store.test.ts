jest.mock('@koku-ui/api/rbac', () => ({
  getRBAC: jest.fn(),
}));

import { getRBAC } from '@koku-ui/api/rbac';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './actions';
import { reducer, stateKey } from './reducer';
import * as selectors from './selectors';

const fetchMock = getRBAC as jest.Mock;

const createStore = createMockStoreCreator({
  [stateKey]: reducer,
});

test('is org admin', async () => {
  fetchMock.mockReturnValueOnce(Promise.resolve({ isOrgAdmin: true, permissions: [] }));
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(selectors.isCostModelWritePermission(store.getState())).toBe(true);
});

test('is not org admin and *:* permissions', async () => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      isOrgAdmin: false,
      permissions: [{ permission: 'cost-management:*:*' }],
    })
  );
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(selectors.isCostModelWritePermission(store.getState())).toBe(true);
});

test('is not org admin and rate:write permissions', async () => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      isOrgAdmin: false,
      permissions: [{ permission: 'cost-management:rate:write' }],
    })
  );
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(selectors.isCostModelWritePermission(store.getState())).toBe(true);
});

test('is not org admin and rate:read permissions', async () => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      isOrgAdmin: false,
      permissions: [{ permission: 'cost-management:rate:read' }],
    })
  );
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(selectors.isCostModelWritePermission(store.getState())).toBe(false);
});

test('is not org admin and no permissions', async () => {
  fetchMock.mockReturnValueOnce(Promise.resolve({ isOrgAdmin: false, permissions: null }));
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(selectors.isCostModelWritePermission(store.getState())).toBe(false);
});

test('is not org admin and no cost-management permissions', async () => {
  fetchMock.mockReturnValueOnce(Promise.resolve({ isOrgAdmin: false, permissions: [] }));
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(selectors.isCostModelWritePermission(store.getState())).toBe(false);
});

test('failure processing request', async () => {
  fetchMock.mockReturnValueOnce(Promise.reject('Error!'));
  const store = createStore();
  await store.dispatch(actions.fetchRbac());
  expect(fetchMock).toHaveBeenCalled();
  expect(store.getState().RBAC.error).toBe('Error!');
});
