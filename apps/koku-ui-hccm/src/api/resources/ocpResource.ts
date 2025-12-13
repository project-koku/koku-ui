import { axiosInstance } from 'api';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.cluster]: 'resource-types/openshift-clusters/',
  [ResourceType.model]: 'resource-types/openshift-gpu-models/',
  [ResourceType.node]: 'resource-types/openshift-nodes/',
  [ResourceType.project]: 'resource-types/openshift-projects/',
  [ResourceType.vendor]: 'resource-types/openshift-gpu-vendors/',
  [ResourceType.virtualization]: 'resource-types/openshift-virtual-machines/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
