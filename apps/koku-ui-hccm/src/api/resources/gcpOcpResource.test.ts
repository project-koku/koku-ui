import { axiosInstance } from 'api';

import { runResource } from './gcpOcpResource';
import { ResourceType } from './resource';

test('runResource API request for OCP on GCP', () => {
  runResource(ResourceType.account, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/gcp-accounts/?openshift=true');
});
