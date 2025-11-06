import type { ResourcePathsType, ResourceType } from 'api/resources/resource';

export const resourceStateKey = 'resource';

export function getFetchId(
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  resourceQueryString: string
) {
  return `${resourcePathsType}--${resourceType}--${resourceQueryString}`;
}
