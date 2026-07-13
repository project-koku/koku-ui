import { axiosInstance } from 'api';
import { RosType } from 'api/ros/ros';

import { runRosReport, runRosReports } from './recommendations';

test('api run reports calls axios get', () => {
  const query = 'limit=10';
  runRosReports(RosType.ros, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`recommendations/openshift?${query}`);
});

test('api run reports calls namespace endpoint', () => {
  const query = 'limit=10';
  runRosReports(RosType.namespace, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`recommendations/openshift/namespace?${query}`);
});

test('api run report by id calls axios get', () => {
  const query = 'abc-123';
  runRosReport(RosType.namespace, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`recommendations/openshift/namespace/${query}`);
});

test('api run report without query calls axios get', () => {
  runRosReport(RosType.container, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('recommendations/openshift/container');
});
