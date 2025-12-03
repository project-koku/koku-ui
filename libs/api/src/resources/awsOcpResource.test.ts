import axiosInstance from '../api';

import { runResource } from './awsOcpResource';
import { ResourceType } from './resource';

test('runExport API request for OCP on AWS', () => {
  runResource(ResourceType.account, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/aws-accounts/?openshift=true');
});
