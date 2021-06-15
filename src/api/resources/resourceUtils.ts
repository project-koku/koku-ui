import { runResource as runAwsResource } from './awsResource';
import { ResourcePathsType, ResourceType } from './resource';

export function isResourceTypeValid(resourcePathsType: ResourcePathsType, resourceType: ResourceType) {
  let result = false;

  if (resourcePathsType === ResourcePathsType.aws) {
    switch (resourceType) {
      case ResourceType.account:
        // case ResourceType.region: // Todo: Not currently supported by the resource-types API
        // case ResourceType.service:
        result = true;
        break;
    }
  }
  return result;
}

export function runResource(resourcePathsType: ResourcePathsType, resourceType: ResourceType, query: string) {
  let forecast;
  switch (resourcePathsType) {
    case ResourcePathsType.aws:
      forecast = runAwsResource(resourceType, query);
      break;
  }
  return forecast;
}
