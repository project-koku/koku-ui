jest.mock('@koku-ui/api/providers');

import { waitFor } from '@testing-library/react';
import { fetchProviders } from '@koku-ui/api/providers';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './actions';
import { reducer, stateKey } from './reducer';
import * as selectors from './selectors';

const mockfetcher = fetchProviders as jest.Mock;

const providers = [
  {
    uuid: 'abcd-efgh-1234-5678',
    name: 'provider-1',
    type: 'AWS',
  },
  {
    uuid: 'efgh-ijkl-5678-9012',
    name: 'provider-2',
    type: 'OCP',
  },
];

const createStore = createMockStoreCreator({
  [stateKey]: reducer,
});

// Avoid spying on ESM exports; assert via selectors

test('default state', async () => {
  const store = createStore();
  expect(store.getState()).toMatchSnapshot();
});

test('fetching succeeded', async () => {
  mockfetcher.mockReturnValueOnce(Promise.resolve({ data: { data: providers } }));
  const store = createStore();
  expect(selectors.sources(store.getState())).toEqual([]);
  expect(selectors.error(store.getState())).toEqual(null);
  store.dispatch(actions.fetchSources());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.sources(store.getState())).toEqual(providers);
  expect(selectors.error(store.getState())).toEqual(null);
  expect(selectors.status(store.getState())).toBe(FetchStatus.complete);
});

test('fetching failed', async () => {
  const error = {
    response: {
      data: { errors: [{ source: 'name', detail: 'is already taken' }] },
    },
  };
  mockfetcher.mockReturnValueOnce(Promise.reject(error));
  const store = createStore();
  expect(selectors.sources(store.getState())).toEqual([]);
  expect(selectors.error(store.getState())).toEqual(null);
  store.dispatch(actions.fetchSources());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.sources(store.getState())).toEqual([]);
  expect(selectors.error(store.getState())).toEqual(error);
  expect(selectors.status(store.getState())).toBe(FetchStatus.complete);
});

test('change filter', () => {
  const store = createStore();
  expect(selectors.currentFilterType(store.getState())).toBe('name');
  expect(selectors.currentFilterValue(store.getState())).toBe('');
  store.dispatch(
    actions.updateFilterToolbar({
      currentFilterType: 'type',
      currentFilterValue: 'OCP',
    })
  );
  expect(selectors.currentFilterType(store.getState())).toBe('type');
  expect(selectors.currentFilterValue(store.getState())).toBe('OCP');
});

test('pagination - first page', async () => {
  const response = {
    data: {
      meta: {
        count: 20,
      },
      links: {
        first: 'localhost:8080/providers/?offset=0&limit=10',
        last: 'localhost:8080/providers/?offset=10&limit=10',
        previous: null,
        next: 'localhost:8080/providers/?offset=10&limit=10',
      },
      data: [],
    },
  };
  mockfetcher.mockReturnValueOnce(Promise.resolve(response));
  const store = createStore();
  store.dispatch(actions.fetchSources());
  await waitFor(() => expect(selectors.pagination(store.getState())).toEqual({ count: 20, page: 1, perPage: 10 }));
  expect(selectors.pagination(store.getState())).toEqual({
    count: 20,
    page: 1,
    perPage: 10,
  });
});

test('pagination - last page', async () => {
  const response = {
    data: {
      meta: {
        count: 20,
      },
      links: {
        first: 'localhost:8080/providers/?offset=0&limit=10',
        last: 'localhost:8080/providers/?offset=10&limit=10',
        previous: 'localhost:8080/providers/?offset=0&limit=10',
        next: null,
      },
      data: [],
    },
  };
  mockfetcher.mockReturnValueOnce(Promise.resolve(response));
  const store = createStore();
  store.dispatch(actions.fetchSources());
  await waitFor(() => expect(selectors.pagination(store.getState())).toEqual({ count: 20, page: 2, perPage: 10 }));
  expect(selectors.pagination(store.getState())).toEqual({
    count: 20,
    page: 2,
    perPage: 10,
  });
});

test('pagination - no response', async () => {
  const response = {
    data: {
      meta: {
        count: 20,
      },
      links: {
        first: 'localhost:8080/providers/?offset=0&limit=10&name=my-provider&type=OCP',
        last: null,
        previous: null,
        next: null,
      },
      data: [],
    },
  };
  mockfetcher.mockReturnValueOnce(Promise.resolve(response));
  const store = createStore();
  store.dispatch(actions.fetchSources());
  await waitFor(() =>
    expect(selectors.query(store.getState())).toEqual({ name: 'my-provider', type: 'OCP', offset: '0', limit: '10' })
  );
  expect(selectors.query(store.getState())).toEqual({
    name: 'my-provider',
    type: 'OCP',
    offset: '0',
    limit: '10',
  });
});

test('query', async () => {
  const response = {
    data: null,
  };
  mockfetcher.mockReturnValueOnce(Promise.resolve(response));
  const store = createStore();
  store.dispatch(actions.fetchSources());
  await waitFor(() => expect(selectors.pagination(store.getState())).toEqual({ count: 0, page: 1, perPage: 1 }));
  expect(selectors.pagination(store.getState())).toEqual({
    count: 0,
    page: 1,
    perPage: 1,
  });
});
