import { runResource as runAwsResource } from './awsResource';
import { runResource as runAzureResource } from './azureResource';
import { ResourcePathsType, ResourceType } from './resource';

// Temporary check until typeahead is implemented for all filters
export function isResourceTypeValid(resourcePathsType: ResourcePathsType, resourceType: ResourceType) {
  let result = false;

  if (resourcePathsType === ResourcePathsType.aws || resourcePathsType === ResourcePathsType.azure) {
    switch (resourceType) {
      case ResourceType.account:
      case ResourceType.region:
      case ResourceType.resourceLocation: // Azure
      case ResourceType.service:
      case ResourceType.serviceName: // Azure
      case ResourceType.subscriptionGuid: // Azure
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
    case ResourcePathsType.azure:
      forecast = runAzureResource(resourceType, query);
      break;
  }
  return forecast;
}
