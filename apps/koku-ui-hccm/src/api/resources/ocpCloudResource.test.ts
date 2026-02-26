import { axiosInstance } from 'api';

import { runResource } from './ocpCloudResource';
import { ResourceType } from './resource';

test('runResource API request for OCP cloud clusters', () => {
  runResource(ResourceType.cluster, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-clusters/?all_cloud=true');
});

test('runResource API request for OCP cloud nodes', () => {
  runResource(ResourceType.node, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-nodes/?all_cloud=true');
});

test('runResource API request for OCP cloud projects', () => {
  runResource(ResourceType.project, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-projects/?all_cloud=true');
});

test('runResource API request for OCP cloud projects with a query', () => {
  runResource(ResourceType.project, 'limit=10');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-projects/?all_cloud=true&limit=10');
});
