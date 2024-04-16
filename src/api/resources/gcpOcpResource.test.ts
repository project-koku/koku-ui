import { axiosInstance } from 'api';

import { runResource } from './gcpOcpResource';
import { ResourceType } from './resource';

test('runExport API request for OCP on GCP', () => {
  runResource(ResourceType.account, '');
  expect(axiosInstance.get).toBeCalledWith('resource-types/gcp-accounts/?');
});
