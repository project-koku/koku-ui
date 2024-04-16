import { axiosInstance } from 'api';

import { ResourceType } from './resource';
import { runResource } from './rhelResource';

test('runExport API request for RHEL', () => {
  runResource(ResourceType.project, '');
  expect(axiosInstance.get).toBeCalledWith('resource-types/openshift-projects/?');
});
