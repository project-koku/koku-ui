import { RosType } from 'api/ros/ros';
import axios from 'axios';

import { runRosReports } from './recommendations';

test('api run reports calls axios get', () => {
  const query = 'limit=10';
  runRosReports(RosType.ros, query);
  expect(axios.get).toBeCalledWith(`recommendations/openshift?${query}`);
});
