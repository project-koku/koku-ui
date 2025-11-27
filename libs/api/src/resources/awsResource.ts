import axiosInstance from '../api';
import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.account]: 'resource-types/aws-accounts/',
  [ResourceType.aws_category]: 'resource-types/aws-categories/',
  [ResourceType.aws_ec2_instance]: 'resource-types/aws-ec2-compute-instances/',
  [ResourceType.aws_ec2_os]: 'resource-types/aws-ec2-compute-os/',
  [ResourceType.region]: 'resource-types/aws-regions/',
  [ResourceType.service]: 'resource-types/aws-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<Resource>(`${path}${queryString}`);
}
