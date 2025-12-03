jest.mock('@koku-ui/api/rates');

global.Date.now = jest.fn(() => 'time');

import type { Rates } from '@koku-ui/api/rates';
import { fetchRate } from '@koku-ui/api/rates';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './actions';
import { reducer, stateKey } from './reducer';
import * as selectors from './selectors';

const createStore = createMockStoreCreator({
  [stateKey]: reducer,
});

const fetchMock = fetchRate as jest.Mock;
const pUuid = '92e9b353-100e-4e38-91bd-e0143f766130';
const fixture = [
  {
    name: 'Cost Management OpenShift Cost Model',
    sources: [
      { name: 'provider-1', uuid: pUuid },
      { name: 'provider-2', uuid: '7fb3bbfb-79d2-4bf7-bd80-ec2bd665887d' },
    ],
    rates: [
      {
        metric: {
          name: 'storage_gb_request_per_month',
          label_measurement_unit: 'GB-months',
          label_measurement: 'Request',
          label_metric: 'Storage',
        },
        tiered_rates: [
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
    ],
  },
  {
    name: 'Another cost model',
    sources: [{ name: 'provider-1', uuid: pUuid }],
    rates: [
      {
        metric: {
          name: 'cpu_core_request_per_hour',
          label_measurement_unit: 'core-hours',
          label_measurement: 'Request',
          label_metric: 'CPU',
        },
        tiered_rates: [
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
  fetchMock.mockReturnValueOnce(Promise.resolve({ data: ratesMock }));
  const store = createStore();
  await store.dispatch(actions.fetchPriceList(pUuid));
  expect(fetchMock).toHaveBeenCalled();
});

test('default state', async () => {
  const store = createStore();
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from init to fetch request', async () => {
  const store = createStore();
  expect(selectors.status(store.getState(), pUuid)).toBe(undefined);
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest({ providerUuid: pUuid }));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
});

test('from fetch request to fetch success', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListRequest({ providerUuid: pUuid }));
  expect(selectors.priceList(store.getState())).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock, { providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
});

test('from fetch request to fetch error', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListRequest({ providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!'), { providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
});

test('from fetch success to fetch request', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock, { providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest({ providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
});

test('from fetch error to fetch request', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!'), { providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
  store.dispatch(actions.fetchPriceListRequest({ providerUuid: pUuid }));
  expect(selectors.priceList(store.getState(), pUuid)).toMatchSnapshot();
});

test('test selectors', async () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListFailure(Error('Opps!'), { providerUuid: pUuid }));
  expect(selectors.error(store.getState(), pUuid)).toEqual(Error('Opps!'));
  store.dispatch(actions.fetchPriceListSuccess(ratesMock, { providerUuid: pUuid }));
  expect(selectors.rates(store.getState(), pUuid)).toEqual(ratesMock.data);
  store.dispatch(actions.fetchPriceListRequest({ providerUuid: pUuid }));
  expect(selectors.status(store.getState(), pUuid)).toBe(FetchStatus.inProgress);
});

test('rateFlatter flats tiers into array', () => {
  fixture.map(fixt => {
    expect(selectors.rateFlatter(fixt)).toMatchSnapshot();
  });
});

test('ratesPerProvider selector returns rates array by provider_uuid', () => {
  const store = createStore();
  store.dispatch(actions.fetchPriceListSuccess(ratesMock, { providerUuid: pUuid }));
  expect(selectors.ratesPerProvider(store.getState(), pUuid)).toMatchSnapshot();
});
