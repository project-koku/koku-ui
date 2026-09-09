import { axiosInstance } from 'api';

import { fetchRos } from './ros';

test('fetchRos calls axiosInstance.get for the ROS OpenAPI spec', () => {
  fetchRos();
  expect(axiosInstance.get).toHaveBeenCalledWith('recommendations/openshift/openapi.json');
});
