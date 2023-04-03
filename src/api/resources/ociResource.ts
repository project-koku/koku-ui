import axios from 'axios';

import type { Resource } from './resource';
import { ResourceType } from './resource';

export const ResourceTypePaths: Partial<Record<ResourceType, string>> = {
  [ResourceType.region]: 'resource-types/oci-regions/',
  [ResourceType.payerTenantId]: 'resource-types/oci-payer-tenant-ids/',
  [ResourceType.productService]: 'resource-types/oci-services/',
};

export function runResource(resourceType: ResourceType, query: string) {
  const path = ResourceTypePaths[resourceType];
  const fetch = () => axios.get<Resource>(`${path}?${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
