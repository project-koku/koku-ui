import { axiosInstance } from 'api';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.account]: 'resource-types/aws-accounts/',
  [ResourceType.aws_category]: 'resource-types/aws-categories/',
  [ResourceType.region]: 'resource-types/aws-regions/',
  [ResourceType.service]: 'resource-types/aws-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
