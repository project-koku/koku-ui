import axios from 'axios';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.resourceLocation]: 'resource-types/azure-regions/',
  [ResourceType.subscriptionGuid]: 'resource-types/azure-subscription-guids/',
  [ResourceType.serviceName]: 'resource-types/azure-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  return axios.get<Resource>(`${path}?${query}`);
}
