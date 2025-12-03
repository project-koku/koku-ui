jest.mock('@koku-ui/api/metrics');

import { waitFor } from '@testing-library/react';
import { fetchRateMetrics } from '@koku-ui/api/metrics';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './actions';
import { reducer as metricsReducer, stateKey } from './reducer';
import * as selectors from './selectors';
const createCostModelsStore = createMockStoreCreator({
  [stateKey]: metricsReducer,
});

const mockfetcher = fetchRateMetrics as jest.Mock;

test('default state', async () => {
  const store = createCostModelsStore();
  expect(store.getState()).toEqual({
    metrics: { status: FetchStatus.none, error: null, metrics: null },
  });
});

test('fetch metrics', async () => {
  mockfetcher.mockReturnValueOnce(
    Promise.resolve({
      data: {
        data: [
          {
            source_type: 'Openshift Container Platform',
            metric: 'cpu_core_request_per_hour',
            label_metric: 'CPU',
            label_measurement: 'Request',
            label_measurement_unit: 'core-hours',
          },
          {
            source_type: 'Openshift Container Platform',
            metric: 'cpu_core_usage_per_hour',
            label_metric: 'CPU',
            label_measurement: 'Usage',
            label_measurement_unit: 'core-hours',
          },
          {
            source_type: 'Openshift Container Platform',
            metric: 'memory_gb_request_per_hour',
            label_metric: 'Memory',
            label_measurement: 'Request',
            label_measurement_unit: 'GiB-hours',
          },
          {
            source_type: 'Openshift Container Platform',
            metric: 'memory_gb_usage_per_hour',
            label_metric: 'Memory',
            label_measurement: 'Usage',
            label_measurement_unit: 'GiB-hours',
          },
        ],
      },
    })
  );
  const store = createCostModelsStore();
  store.dispatch(actions.fetchMetrics());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.status(store.getState())).toBe(FetchStatus.complete);
  expect(selectors.error(store.getState())).toBe('');
  expect(selectors.metrics(store.getState())).toEqual({
    CPU: {
      cpu_core_request_per_hour: {
        source_type: 'Openshift Container Platform',
        metric: 'cpu_core_request_per_hour',
        label_metric: 'CPU',
        label_measurement: 'Request',
        label_measurement_unit: 'core-hours',
      },
      cpu_core_usage_per_hour: {
        source_type: 'Openshift Container Platform',
        metric: 'cpu_core_usage_per_hour',
        label_metric: 'CPU',
        label_measurement: 'Usage',
        label_measurement_unit: 'core-hours',
      },
    },
    Memory: {
      memory_gb_request_per_hour: {
        source_type: 'Openshift Container Platform',
        metric: 'memory_gb_request_per_hour',
        label_metric: 'Memory',
        label_measurement: 'Request',
        label_measurement_unit: 'GiB-hours',
      },
      memory_gb_usage_per_hour: {
        source_type: 'Openshift Container Platform',
        metric: 'memory_gb_usage_per_hour',
        label_metric: 'Memory',
        label_measurement: 'Usage',
        label_measurement_unit: 'GiB-hours',
      },
    },
  });
  expect(selectors.maxRate(store.getState())).toEqual(4);
});

test('fetch metrics null', async () => {
  mockfetcher.mockReturnValueOnce(
    Promise.resolve({
      data: null,
    })
  );
  const store = createCostModelsStore();
  store.dispatch(actions.fetchMetrics());
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.metrics(store.getState())).toEqual({});
  expect(selectors.maxRate(store.getState())).toEqual(0);
});

test('fetch metrics error', async () => {
  mockfetcher.mockReturnValueOnce(Promise.reject('Failure!'));
  const store = createCostModelsStore();
  store.dispatch(actions.fetchMetrics());
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.error(store.getState())).toEqual('unknown');
  expect(selectors.metrics(store.getState())).toEqual({});
  expect(selectors.maxRate(store.getState())).toEqual(0);
});
