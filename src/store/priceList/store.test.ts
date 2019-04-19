jest.mock('api/rates');

import { fetchRate, Rates } from 'api/rates';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './actions';
import { reducer, stateKey } from './reducer';
import * as selectors from './selectors';

const createStore = createMockStoreCreator({
  [stateKey]: reducer,
});

const fetchMock = fetchRate as jest.Mock;

const fixture = [
  {
    metric: {
      display_name: 'Volume request rate',
      name: 'storage_gb_request_per_month',
      unit: 'GB-months',
    },
    provider_uuids: [
      '92e9b353-100e-4e38-91bd-e0143f766130',
      '7fb3bbfb-79d2-4bf7-bd80-ec2bd665887d',
    ],
    tiered_rate: [
      {
        unit: 'USD',
        value: 0.25,
        usage: {
          usage_start: null,
          usage_end: null,
          unit: 'GB-months',
        },
      },
      {
        unit: 'USD',
        value: 0.25,
        usage: {
          usage_start: 500.0,
          usage_end: 1120.0,
          unit: 'GB-months',
        },
      },
    ],
  },
  {
    metric: {
      display_name: 'Compute request rate',
      name: 'cpu_core_request_per_hour',
      unit: 'core-hours',
    },
    provider_uuids: ['92e9b353-100e-4e38-91bd-e0143f766130'],
    tiered_rate: [
      {
        unit: 'USD',
        value: 0.2,
        usage: {
          usage_start: null,
          usage_end: 5.0,
          unit: 'core-hours',
        },
      },
      {
        unit: 'USD',
        value: 0.25,
        usage: {
          usage_start: 3.0,
          usage_end: null,
          unit: 'GB-months',
        },
      },
    ],
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
  const store = createStore();
  await store.dispatch(actions.fetchPriceList());
  expect(fetchMock).toBeCalled();
  expect(selectors.rates(store.getState())).toEqual(ratesMock.data);
  await store.dispatch(actions.fetchPriceList());
  expect(fetchMock).toBeCalled();
  expect(selectors.error(store.getState())).toEqual(Error('rejected!'));
});

test('default state', async () => {
  const store = createStore();
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from init to fetch request', async () => {
  const store = createStore();
  expect(selectors.status(store.getState())).toBe(FetchStatus.none);
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch request to fetch success', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch request to fetch error', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!')));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch success to fetch request', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch error to fetch request', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!')));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('test selectors', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!')));
  expect(selectors.error(store.getState())).toEqual(Error('Opps!'));
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.rates(store.getState())).toEqual(ratesMock.data);
  store.dispatch(actions.fetchPriceListRequest());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
});

test('rateFlatter flats tiers into array', () => {
  fixture.map(fixt => {
    expect(selectors.rateFlatter(fixt)).toMatchSnapshot();
  });
});

test('ratesPerProvider selector returns rates array by provider_uuid', () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock));
  expect(selectors.ratesPerProvider(store.getState())).toMatchSnapshot();
});
