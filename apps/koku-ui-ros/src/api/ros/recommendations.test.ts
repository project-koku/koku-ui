import { axiosInstance } from 'api';
import { RosType } from 'api/ros/ros';

import { runRosReports } from './recommendations';

test('api run reports calls axios get', () => {
  const query = 'limit=10';
  runRosReports(RosType.ros, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`recommendations/openshift?${query}`);
});
