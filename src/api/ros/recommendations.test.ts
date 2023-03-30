import { RosType } from 'api/ros/ros';
import axios from 'axios';

import { runRosReport } from './recommendations';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runRosReport(RosType.ros, query);
  expect(axios.get).toBeCalledWith(`recommendations/openshift/?${query}`);
});
