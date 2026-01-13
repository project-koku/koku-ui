import { axiosInstance } from 'api';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.account]: 'resource-types/gcp-accounts/',
  [ResourceType.cluster]: 'resource-types/openshift-clusters/',
  [ResourceType.gcpProject]: 'resource-types/gcp-projects/',
  [ResourceType.node]: 'resource-types/openshift-nodes/',
  [ResourceType.project]: 'resource-types/openshift-projects/',
  [ResourceType.region]: 'resource-types/gcp-regions/',
  [ResourceType.service]: 'resource-types/gcp-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  const ocpResourceTypes = [ResourceType.account, ResourceType.gcpProject, ResourceType.region, ResourceType.service];
  const openshiftParam = ocpResourceTypes.includes(resourceType) ? 'openshift=true' : '';

  let queryString = '';
  if (openshiftParam && query) {
    queryString = `?${openshiftParam}&${query}`;
  } else if (openshiftParam) {
    queryString = `?${openshiftParam}`;
  } else if (query) {
    queryString = `?${query}`;
  }
  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
