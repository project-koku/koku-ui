import axiosInstance from '../api';

import { runResource } from './azureResource';
import { ResourceType } from './resource';

test('runExport API request for Azure', () => {
  runResource(ResourceType.subscriptionGuid, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/azure-subscription-guids/?');
});
