import { freeAvialableRates } from './addRateModel';

const CpuUsgRate = {
  metric: {
    name: 'cpu_core_usage_per_hour',
    label_metric: 'CPU',
    label_measurement: 'Usage',
    label_measurement_unit: 'core-hour',
  },
  tiered_rates: [],
};

const CpuReqRate = {
  metric: {
    name: 'cpu_core_request_per_hour',
    label_metric: 'CPU',
    label_measurement: 'Request',
    label_measurement_unit: 'core-hour',
  },
  tiered_rates: [],
};

const MemUsgRate = {
  metric: {
    name: 'memory_gb_usage_per_hour',
    label_metric: 'Memory',
    label_measurement: 'Usage',
    label_measurement_unit: 'gb-hour',
  },
  tiered_rates: [],
};

const MemReqRate = {
  metric: {
    name: 'memory_gb_request_per_hour',
    label_metric: 'Memory',
    label_measurement: 'Request',
    label_measurement_unit: 'gb-hour',
  },
  tiered_rates: [],
};

const StgUsgRate = {
  metric: {
    name: 'storage_gb_usage_per_month',
    label_metric: 'Storage',
    label_measurement: 'Usage',
    label_measurement_unit: 'gb-month',
  },
  tiered_rates: [],
};

const StgReqRate = {
  metric: {
    name: 'storage_gb_request_per_month',
    label_metric: 'Storage',
    label_measurement: 'Request',
    label_measurement_unit: 'gb-month',
  },
  tiered_rates: [],
};

test('freeAvailableReates', () => {
  let rates = [MemUsgRate, MemReqRate, CpuUsgRate, CpuReqRate];

  expect(freeAvialableRates(rates)).toEqual([
    { metric: 'storage', measurement: 'usage' },
    { metric: 'storage', measurement: 'request' },
    { metric: 'node', measurement: 'currency' },
  ]);

  rates = [MemUsgRate, CpuReqRate];

  expect(freeAvialableRates(rates)).toEqual([
    { metric: 'cpu', measurement: 'usage' },
    { metric: 'storage', measurement: 'usage' },
    { metric: 'memory', measurement: 'request' },
    { metric: 'storage', measurement: 'request' },
    { metric: 'node', measurement: 'currency' },
  ]);
});
