import { axiosInstance } from 'api';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.cluster]: 'resource-types/openshift-clusters/',
  [ResourceType.node]: 'resource-types/openshift-nodes/',
  [ResourceType.project]: 'resource-types/openshift-projects/',
  [ResourceType.resourceLocation]: 'resource-types/azure-regions/',
  [ResourceType.subscriptionGuid]: 'resource-types/azure-subscription-guids/',
  [ResourceType.serviceName]: 'resource-types/azure-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  return axiosInstance.get<Resource>(`${path}?${query}`);
}
