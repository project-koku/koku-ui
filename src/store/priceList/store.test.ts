jest.mock('api/rates');

import { fetchRate, Rates } from 'api/rates';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './actions';
import { reducer, stateKey } from './reducer';
import * as selectors from './selectors';

const createProdvidersStore = createMockStoreCreator({
  [stateKey]: reducer,
});

const fetchMock = fetchRate as jest.Mock;

const fixture = [
  {
    uuid: 'a1',
    provider_uuid: 'p1',
    metric: 'cpu_usage_per_hour',
    tiered: {
      unit: 'usd',
      value: 2.03,
    },
  },
];

const ratesMock: Rates = {
  count: fixture.length,
  first: 'link1',
  previous: null,
  next: 'link2',
  last: 'link2',
  data: fixture,
};

test('test fetch price list action', async () => {
  fetchMock
    .mockReturnValueOnce(Promise.resolve({ data: ratesMock }))
    .mockReturnValueOnce(Promise.reject(Error('rejected!')));
  const store = createProdvidersStore();
  await store.dispatch(actions.fetchPriceList());
  expect(fetchMock).toBeCalled();
  expect(selectors.rates(store.getState())).toEqual(ratesMock.data);
  await store.dispatch(actions.fetchPriceList());
  expect(fetchMock).toBeCalled();
  expect(selectors.error(store.getState())).toEqual(Error('rejected!'));
});

test('default state', async () => {
  const store = createProdvidersStore();
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from init to fetch request', async () => {
  const store = createProdvidersStore();
  expect(selectors.status(store.getState())).toBe(FetchStatus.none);
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch request to fetch success', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch request to fetch error', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!')));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch success to fetch request', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch error to fetch request', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!')));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('test selectors', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!')));
  expect(selectors.error(store.getState())).toEqual(Error('Opps!'));
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.rates(store.getState())).toEqual(ratesMock.data);
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
});
