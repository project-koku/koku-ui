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

  let queryParams = '';
  switch (resourceType) {
    case ResourceType.resourceLocation:
    case ResourceType.serviceName:
    case ResourceType.subscriptionGuid:
      queryParams = 'openshift=true';
      break;
    case ResourceType.cluster:
    case ResourceType.node:
    case ResourceType.project:
      // Todo: Enable for https://issues.redhat.com/browse/COST-6957
      // queryParams = 'azure=true';
      break;
  }

  const params = [queryParams, query].filter(Boolean);
  const queryString = params.length ? `?${params.join('&')}` : '';

  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
