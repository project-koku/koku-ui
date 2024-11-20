import { runResource as runAwsOcpResource } from './awsOcpResource';
import { runResource as runAwsResource } from './awsResource';
import { runResource as runAzureOcpResource } from './azureOcpResource';
import { runResource as runAzureResource } from './azureResource';
import { runResource as runGcpOcpResource } from './gcpOcpResource';
import { runResource as runGcpResource } from './gcpResource';
import { runResource as runIbmResource } from './ibmResource';
import { runResource as runOciResource } from './ociResource';
import { runResource as runOcpResource } from './ocpResource';
import { ResourcePathsType, ResourceType } from './resource';
import { runResource as runRhelResource } from './rhelResource';

// Temporary check until typeahead is implemented for all filters
export function isResourceTypeValid(resourcePathsType: ResourcePathsType, resourceType: ResourceType) {
  let result = false;

  if (
    resourcePathsType === ResourcePathsType.aws ||
    resourcePathsType === ResourcePathsType.awsOcp ||
    resourcePathsType === ResourcePathsType.azure ||
    resourcePathsType === ResourcePathsType.azureOcp ||
    resourcePathsType === ResourcePathsType.gcp ||
    resourcePathsType === ResourcePathsType.gcpOcp ||
    resourcePathsType === ResourcePathsType.ibm ||
    resourcePathsType === ResourcePathsType.ibmOcp ||
    resourcePathsType === ResourcePathsType.oci ||
    resourcePathsType === ResourcePathsType.ocp ||
    resourcePathsType === ResourcePathsType.ocpCloud
    // Todo: add type-ahead support when API is available
    // resourcePathsType === ResourcePathsType.rhel
  ) {
    switch (resourceType) {
      case ResourceType.account:
      case ResourceType.aws_category:
      case ResourceType.aws_ec2_instance:
      case ResourceType.aws_ec2_os:
      case ResourceType.cluster:
      case ResourceType.gcpProject:
      case ResourceType.node:
      case ResourceType.payerTenantId:
      case ResourceType.productService:
      case ResourceType.project:
      case ResourceType.region:
      case ResourceType.resourceLocation:
      case ResourceType.service:
      case ResourceType.serviceName:
      case ResourceType.subscriptionGuid:
      case ResourceType.virtualization:
        result = true;
        break;
    }
  }
  return result;
}

export function runResource(resourcePathsType: ResourcePathsType, resourceType: ResourceType, query: string) {
  let result;
  switch (resourcePathsType) {
    case ResourcePathsType.aws:
      result = runAwsResource(resourceType, query);
      break;
    case ResourcePathsType.awsOcp:
      result = runAwsOcpResource(resourceType, query);
      break;
    case ResourcePathsType.azure:
      result = runAzureResource(resourceType, query);
      break;
    case ResourcePathsType.azureOcp:
      result = runAzureOcpResource(resourceType, query);
      break;
    case ResourcePathsType.gcp:
      result = runGcpResource(resourceType, query);
      break;
    case ResourcePathsType.gcpOcp:
      result = runGcpOcpResource(resourceType, query);
      break;
    case ResourcePathsType.ibm:
      result = runIbmResource(resourceType, query);
      break;
    case ResourcePathsType.oci:
      result = runOciResource(resourceType, query);
      break;
    case ResourcePathsType.ocp:
    case ResourcePathsType.ocpCloud:
      result = runOcpResource(resourceType, query);
      break;
    case ResourcePathsType.rhel:
      result = runRhelResource(resourceType, query);
      break;
  }
  return result;
}
