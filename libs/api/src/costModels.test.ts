import axiosInstance from './api';

import type { CostModelRequest } from './costModels';
import { addCostModel, deleteCostModel, fetchCostModels, updateCostModel } from './costModels';

test('api get cost models calls axios to costmodels', () => {
  fetchCostModels();
  expect(axiosInstance.get).toHaveBeenCalledWith('cost-models/');
});

test('api get cost models calls axios to costmodels with query', () => {
  const query = 'limit=20&offset=10';
  fetchCostModels(query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`cost-models/?${query}`);
});

test('add cost model calls axios post', () => {
  const request: CostModelRequest = {
    name: 'my-cost-model',
    source_type: 'AWS',
    source_uuids: ['12232', '3321'],
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
  expect(axiosInstance.post).toHaveBeenCalledWith('cost-models/', request);
});

test('update cost model calls axios put', () => {
  const request: CostModelRequest = {
    name: 'my-cost-model',
    source_type: 'AWS',
    source_uuids: ['12232', '3321'],
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
  expect(axiosInstance.put).toHaveBeenCalledWith('cost-models/123abc456def/', request);
});

test('delete cost model calls axios delete', () => {
  deleteCostModel('123abc456def');
  expect(axiosInstance.delete).toHaveBeenCalledWith('cost-models/123abc456def/');
});
