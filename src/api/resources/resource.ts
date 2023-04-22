import type { PagedMetaData, PagedResponse } from 'api/api';

export interface ResourceData {
  account_alias?: string;
  cluster_alias?: string;
  key?: string;
  value?: string | string[];
}

export interface Resource extends PagedResponse<ResourceData, PagedMetaData> {}

// eslint-disable-next-line no-shadow
export const enum ResourceType {
  account = 'account',
  aws_category = 'aws_category',
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
}

// eslint-disable-next-line no-shadow
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
