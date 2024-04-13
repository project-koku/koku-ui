import { axiosInstance } from 'api';

import { runResource } from './ociResource';
import { ResourceType } from './resource';

test('runExport API request for OCI', () => {
  runResource(ResourceType.payerTenantId, '');
  expect(axiosInstance.get).toBeCalledWith('resource-types/oci-payer-tenant-ids/?');
});
