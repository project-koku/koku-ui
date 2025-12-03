import axiosInstance from './api';

import { fetchRateMetrics } from './metrics';

test('api get OpenShift metrics', () => {
  fetchRateMetrics('OCP');
  expect(axiosInstance.get).toHaveBeenCalledWith('metrics/?limit=1000&source_type=OCP');
});

test('api get all metrics', () => {
  fetchRateMetrics();
  expect(axiosInstance.get).toHaveBeenCalledWith('metrics/?limit=1000');
});
