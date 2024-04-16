import { axiosInstance } from 'api';

import { runResource } from './ibmResource';
import { ResourceType } from './resource';

test('runExport API request for IBM', () => {
  runResource(ResourceType.account, '');
  expect(axiosInstance.get).toBeCalledWith('resource-types/gcp-accounts/?');
});
