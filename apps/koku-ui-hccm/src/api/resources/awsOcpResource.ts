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
  const ocpResourceTypes = [ResourceType.account, ResourceType.aws_category, ResourceType.region, ResourceType.service];
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
