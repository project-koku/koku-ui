import { runResource as runAwsOcpResource } from './awsOcpResource';
import { runResource as runAwsResource } from './awsResource';
import { runResource as runAzureOcpResource } from './azureOcpResource';
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
    resourcePathsType === ResourcePathsType.awsOcp ||
    resourcePathsType === ResourcePathsType.azure ||
    resourcePathsType === ResourcePathsType.azureOcp ||
    resourcePathsType === ResourcePathsType.gcp ||
    resourcePathsType === ResourcePathsType.ibm ||
    resourcePathsType === ResourcePathsType.ocp ||
    resourcePathsType === ResourcePathsType.ocpCloud
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
    case ResourcePathsType.awsOcp:
      forecast = runAwsOcpResource(resourceType, query);
      break;
    case ResourcePathsType.azure:
      forecast = runAzureResource(resourceType, query);
      break;
    case ResourcePathsType.azureOcp:
      forecast = runAzureOcpResource(resourceType, query);
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
    case ResourcePathsType.ocpCloud:
      forecast = runOcpResource(resourceType, query);
      break;
  }
  return forecast;
}
