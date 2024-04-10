import { axiosInstance } from 'api';

import { fetchRateMetrics } from './metrics';

test('api get OpenShift metrics', () => {
  fetchRateMetrics('OCP');
  expect(axiosInstance.get).toBeCalledWith('metrics/?limit=20&source_type=OCP');
});

test('api get all metrics', () => {
  fetchRateMetrics();
  expect(axiosInstance.get).toBeCalledWith('metrics/?limit=20');
});
