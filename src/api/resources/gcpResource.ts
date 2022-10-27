import axios from 'axios';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.account]: 'resource-types/gcp-accounts/',
  [ResourceType.gcpProject]: 'resource-types/gcp-projects/',
  [ResourceType.region]: 'resource-types/gcp-regions/',
  [ResourceType.service]: 'resource-types/gcp-services/',
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
