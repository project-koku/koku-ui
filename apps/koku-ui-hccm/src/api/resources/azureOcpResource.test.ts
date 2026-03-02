import { axiosInstance } from 'api';

import { runResource } from './azureOcpResource';
import { ResourceType } from './resource';

test('runResource API request for OCP on Azure', () => {
  runResource(ResourceType.subscriptionGuid, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/azure-subscription-guids/?openshift=true');
});
