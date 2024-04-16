import { axiosInstance } from 'api';

import { runResource } from './gcpResource';
import { ResourceType } from './resource';

test('runExport API request for GCP', () => {
  runResource(ResourceType.account, '');
  expect(axiosInstance.get).toBeCalledWith('resource-types/gcp-accounts/?');
});
