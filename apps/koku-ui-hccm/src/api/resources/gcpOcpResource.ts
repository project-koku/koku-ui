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

  let queryParams = '';
  switch (resourceType) {
    case ResourceType.account:
    case ResourceType.gcpProject:
    case ResourceType.region:
    case ResourceType.service:
      queryParams = 'openshift=true';
      break;
    case ResourceType.cluster:
    case ResourceType.node:
    case ResourceType.project:
      queryParams = 'gcp=true';
      break;
  }

  const params = [queryParams, query].filter(Boolean);
  const queryString = params.length ? `?${params.join('&')}` : '';

  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
