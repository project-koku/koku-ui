import type { ResourcePathsType, ResourceType } from 'api/resources/resource';

export const resourceStateKey = 'resource';

export function getResourceId(resourcePathsType: ResourcePathsType, resourceType: ResourceType, query: string) {
  return `${resourcePathsType}--${resourceType}--${query}`;
}
