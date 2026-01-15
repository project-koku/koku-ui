import { axiosInstance } from 'api';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.cluster]: 'resource-types/openshift-clusters/',
  [ResourceType.node]: 'resource-types/openshift-nodes/',
  [ResourceType.project]: 'resource-types/openshift-projects/',
};

// Note that OCP cloud does not support GPU and virtualization resource paths
export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];

  const queryParams = '';
  switch (resourceType) {
    case ResourceType.cluster:
    case ResourceType.node:
    case ResourceType.project:
      // Todo: Enable for https://issues.redhat.com/browse/COST-6957
      // queryParams = 'ocp_cloud=true';
      break;
  }

  const params = [queryParams, query].filter(Boolean);
  const queryString = params.length ? `?${params.join('&')}` : '';

  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
