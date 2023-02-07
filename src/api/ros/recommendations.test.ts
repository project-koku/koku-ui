import { RosType } from 'api/ros/ros';
import axios from 'axios';

import { runRos } from './recommendations';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runRos(RosType.cost, query);
  expect(axios.get).toBeCalledWith(`reports/openshift/costs/?${query}`);
});
