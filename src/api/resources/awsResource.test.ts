import { axiosInstance } from 'api';

import { runResource } from './awsResource';
import { ResourceType } from './resource';

test('runExport API request for AWS', () => {
  runResource(ResourceType.account, '');
  expect(axiosInstance.get).toBeCalledWith('resource-types/aws-accounts/');
});
