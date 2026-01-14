import { axiosInstance } from 'api';

import { runResource } from './ocpResource';
import { ResourceType } from './resource';

test('runExport API request for OCP all cloud', () => {
  runResource(ResourceType.project, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-projects/');
});
