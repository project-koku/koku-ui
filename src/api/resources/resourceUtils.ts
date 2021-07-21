import { runResource as runAwsCloudResource } from './awsCloudResource';
import { runResource as runAwsResource } from './awsResource';
import { runResource as runAzureCloudResource } from './azureCloudResource';
import { runResource as runAzureResource } from './azureResource';
import { runResource as runGcpOcpResource } from './gcpOcpResource';
import { runResource as runGcpResource } from './gcpResource';
import { runResource as runIbmResource } from './ibmResource';
import { runResource as runOcpResource } from './ocpResource';
import { ResourcePathsType, ResourceType } from './resource';

// Temporary check until typeahead is implemented for all filters
export function isResourceTypeValid(resourcePathsType: ResourcePathsType, resourceType: ResourceType) {
  let result = false;

  if (
    resourcePathsType === ResourcePathsType.aws ||
    resourcePathsType === ResourcePathsType.awsCloud ||
    resourcePathsType === ResourcePathsType.azure ||
    resourcePathsType === ResourcePathsType.azureCloud ||
    resourcePathsType === ResourcePathsType.gcp ||
    resourcePathsType === ResourcePathsType.ibm ||
    resourcePathsType === ResourcePathsType.ocp
  ) {
    switch (resourceType) {
      case ResourceType.account:
      case ResourceType.cluster:
      case ResourceType.node:
      case ResourceType.project:
      case ResourceType.region:
      case ResourceType.resourceLocation:
      case ResourceType.service:
      case ResourceType.serviceName:
      case ResourceType.subscriptionGuid:
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
    case ResourcePathsType.awsCloud:
      forecast = runAwsCloudResource(resourceType, query);
      break;
    case ResourcePathsType.azure:
      forecast = runAzureResource(resourceType, query);
      break;
    case ResourcePathsType.azureCloud:
      forecast = runAzureCloudResource(resourceType, query);
      break;
    case ResourcePathsType.gcp:
      forecast = runGcpResource(resourceType, query);
      break;
    case ResourcePathsType.gcpOcp:
      forecast = runGcpOcpResource(resourceType, query);
      break;
    case ResourcePathsType.ibm:
      forecast = runIbmResource(resourceType, query);
      break;
    case ResourcePathsType.ocp:
      forecast = runOcpResource(resourceType, query);
      break;
  }
  return forecast;
}
