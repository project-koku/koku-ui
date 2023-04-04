import axios from 'axios';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.cluster]: 'resource-types/openshift-clusters/',
  [ResourceType.node]: 'resource-types/openshift-nodes/',
  [ResourceType.project]: 'resource-types/openshift-projects/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  return axios.get<Resource>(`${path}?${query}`);
}
