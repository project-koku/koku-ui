import type { PagedMetaData, PagedResponse } from 'api/api';

export interface ResourceData {
  account_alias?: string;
  cluster_alias?: string;
  instance_name?: string;
  key?: string;
  value?: string | string[];
}

export type Resource = PagedResponse<ResourceData, PagedMetaData>;

export const enum ResourceType {
  account = 'account',
  aws_category = 'aws_category',
  aws_ec2_instance = 'instance',
  aws_ec2_os = 'operating_system',
  cluster = 'cluster',
  gcpProject = 'gcp_project',
  node = 'node',
  payerTenantId = 'payer_tenant_id',
  productService = 'product_service',
  project = 'project',
  region = 'region',
  resourceLocation = 'resource_location',
  service = 'service',
  serviceName = 'service_name',
  subscriptionGuid = 'subscription_guid',
  virtualization = 'vm_name',
}

export const enum ResourcePathsType {
  aws = 'aws',
  awsOcp = 'aws_ocp',
  azure = 'azure',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ibm = 'ibm',
  ibmOcp = 'ibm_ocp',
  oci = 'oci',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
  rhel = 'rhel',
}
