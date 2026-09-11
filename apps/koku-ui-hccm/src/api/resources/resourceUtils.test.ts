import { ResourcePathsType, ResourceType } from './resource';
import { isResourceTypeValid, runResource } from './resourceUtils';

jest.mock('./awsResource', () => ({ runResource: jest.fn(() => 'aws') }));
jest.mock('./awsOcpResource', () => ({ runResource: jest.fn(() => 'awsOcp') }));
jest.mock('./azureResource', () => ({ runResource: jest.fn(() => 'azure') }));
jest.mock('./azureOcpResource', () => ({ runResource: jest.fn(() => 'azureOcp') }));
jest.mock('./gcpResource', () => ({ runResource: jest.fn(() => 'gcp') }));
jest.mock('./gcpOcpResource', () => ({ runResource: jest.fn(() => 'gcpOcp') }));
jest.mock('./ocpResource', () => ({ runResource: jest.fn(() => 'ocp') }));
jest.mock('./ocpCloudResource', () => ({ runResource: jest.fn(() => 'ocpCloud') }));

import { runResource as runAwsOcpResource } from './awsOcpResource';
import { runResource as runAwsResource } from './awsResource';
import { runResource as runAzureOcpResource } from './azureOcpResource';
import { runResource as runAzureResource } from './azureResource';
import { runResource as runGcpOcpResource } from './gcpOcpResource';
import { runResource as runGcpResource } from './gcpResource';
import { runResource as runOcpCloudResource } from './ocpCloudResource';
import { runResource as runOcpResource } from './ocpResource';

describe('isResourceTypeValid', () => {
  const validTypes = [
    ResourceType.account,
    ResourceType.aws_category,
    ResourceType.aws_ec2_instance,
    ResourceType.aws_ec2_os,
    ResourceType.cluster,
    ResourceType.gcpProject,
    ResourceType.gpuModel,
    ResourceType.gpuVendor,
    ResourceType.node,
    ResourceType.payerTenantId,
    ResourceType.productService,
    ResourceType.project,
    ResourceType.region,
    ResourceType.resourceLocation,
    ResourceType.service,
    ResourceType.serviceName,
    ResourceType.subscriptionGuid,
    ResourceType.virtualization,
  ];

  test.each(Object.values(ResourcePathsType))('accepts known types for %s', pathType => {
    validTypes.forEach(type => {
      expect(isResourceTypeValid(pathType, type)).toBe(true);
    });
  });

  test('rejects unknown resource types and path types', () => {
    expect(isResourceTypeValid(ResourcePathsType.aws, 'not-a-type' as ResourceType)).toBe(false);
    expect(isResourceTypeValid('unknown' as ResourcePathsType, ResourceType.account)).toBe(false);
  });
});

describe('runResource', () => {
  const query = 'search=prod';

  test.each([
    [ResourcePathsType.aws, runAwsResource, 'aws'],
    [ResourcePathsType.awsOcp, runAwsOcpResource, 'awsOcp'],
    [ResourcePathsType.azure, runAzureResource, 'azure'],
    [ResourcePathsType.azureOcp, runAzureOcpResource, 'azureOcp'],
    [ResourcePathsType.gcp, runGcpResource, 'gcp'],
    [ResourcePathsType.gcpOcp, runGcpOcpResource, 'gcpOcp'],
    [ResourcePathsType.ocp, runOcpResource, 'ocp'],
    [ResourcePathsType.ocpCloud, runOcpCloudResource, 'ocpCloud'],
  ] as const)('dispatches %s resources', (pathType, fn, result) => {
    expect(runResource(pathType, ResourceType.account, query)).toBe(result);
    expect(fn).toHaveBeenCalledWith(ResourceType.account, query);
  });

  test('returns undefined for unknown path types', () => {
    expect(runResource('unknown' as ResourcePathsType, ResourceType.account, query)).toBeUndefined();
  });
});
