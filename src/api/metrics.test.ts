import axios from 'axios';

import { fetchRateMetrics } from './metrics';

test('api get OpenShift metrics', () => {
  fetchRateMetrics('OCP');
  expect(axios.get).toBeCalledWith('metrics/?limit=20&source_type=OCP');
});

test('api get all metrics', () => {
  fetchRateMetrics();
  expect(axios.get).toBeCalledWith('metrics/?limit=20');
});
