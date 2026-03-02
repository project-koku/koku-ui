import { axiosInstance } from 'api';

import { runResource } from './ocpResource';
import { ResourceType } from './resource';

test('runResource API request for OCP clusters', () => {
  runResource(ResourceType.cluster, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-clusters/');
});

test('runResource API request for OCP gpuModel', () => {
  runResource(ResourceType.gpuModel, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-gpu-models/');
});

test('runResource API request for OCP gpuVendor', () => {
  runResource(ResourceType.gpuVendor, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-gpu-vendors/');
});

test('runResource API request for OCP nodes', () => {
  runResource(ResourceType.node, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-nodes/');
});

test('runResource API request for OCP projects', () => {
  runResource(ResourceType.project, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-projects/');
});

test('runResource API request for OCP projects with a query', () => {
  runResource(ResourceType.project, 'limit=10');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-projects/?limit=10');
});

test('runResource API request for OCP virtualization', () => {
  runResource(ResourceType.virtualization, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-virtual-machines/');
});
