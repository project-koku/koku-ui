import axiosInstance from './api';

import { fetchRate } from './rates';

test('api get provider calls axiosInstance.get', () => {
  fetchRate();
  expect(axiosInstance.get).toHaveBeenCalledWith('cost-models/');
});
