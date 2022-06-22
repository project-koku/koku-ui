import axios from 'axios';

import { Resource, ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.resourceLocation]: 'resource-types/oci-regions/',
  [ResourceType.subscriptionGuid]: 'resource-types/oci-subscription-guids/',
  [ResourceType.serviceName]: 'resource-types/oci-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const insights = (window as any).insights;
  const path = ResourceTypePaths[resourceType];
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Resource>(`${path}?${query}`);
    });
  } else {
    return axios.get<Resource>(`${path}?${query}`);
  }
}
