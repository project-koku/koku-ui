jest.mock('axios');

import axios from 'axios';
import {
  addCostModel,
  CostModelRequest,
  fetchCostModels,
  updateCostModel,
} from './costModels';

test('api get cost models calls axios to costmodels', () => {
  fetchCostModels();
  expect(axios.get).toBeCalledWith('costmodels/');
});

test('api get cost models calls axios to costmodels with query', () => {
  const query = 'limit=20&offset=10';
  fetchCostModels(query);
  expect(axios.get).toBeCalledWith(`costmodels/?${query}`);
});

test('add cost model calls axios post', () => {
  const request: CostModelRequest = {
    name: 'my-cost-model',
    source_type: 'AWS',
    provider_uuids: ['12232', '3321'],
    rates: [
      {
        metric: { name: 'cpu_core_request_per_hour' },
        tiered_rates: [
          {
            unit: 'USD',
            value: 9,
            usage: { usage_start: null, usage_end: null, unit: 'USD' },
          },
        ],
      },
    ],
  };
  addCostModel(request);
  expect(axios.post).toBeCalledWith('costmodels/', request);
});

test('update cost model calls axios put', () => {
  const request: CostModelRequest = {
    name: 'my-cost-model',
    source_type: 'AWS',
    provider_uuids: ['12232', '3321'],
    rates: [
      {
        metric: { name: 'cpu_core_request_per_hour' },
        tiered_rates: [
          {
            unit: 'USD',
            value: 9,
            usage: { usage_start: null, usage_end: null, unit: 'USD' },
          },
        ],
      },
    ],
  };
  updateCostModel('123abc456def', request);
  expect(axios.put).toBeCalledWith('costmodels/123abc456def/', request);
});
