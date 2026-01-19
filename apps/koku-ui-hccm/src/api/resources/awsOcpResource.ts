import { axiosInstance } from 'api';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.account]: 'resource-types/aws-accounts/',
  [ResourceType.aws_category]: 'resource-types/aws-categories/',
  [ResourceType.cluster]: 'resource-types/openshift-clusters/',
  [ResourceType.node]: 'resource-types/openshift-nodes/',
  [ResourceType.project]: 'resource-types/openshift-projects/',
  [ResourceType.region]: 'resource-types/aws-regions/',
  [ResourceType.service]: 'resource-types/aws-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];

  let queryParams = '';
  switch (resourceType) {
    case ResourceType.account:
    case ResourceType.aws_category:
    case ResourceType.region:
    case ResourceType.service:
      queryParams = 'openshift=true';
      break;
    case ResourceType.cluster:
    case ResourceType.node:
    case ResourceType.project:
      // Todo: Enable for https://issues.redhat.com/browse/COST-6957
      // queryParams = 'aws=true';
      break;
  }

  const params = [queryParams, query].filter(Boolean);
  const queryString = params.length ? `?${params.join('&')}` : '';

  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
