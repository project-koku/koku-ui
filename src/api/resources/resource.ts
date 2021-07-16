export interface ResourceData {
  account_alias: string;
  cluster_alias: string;
  value?: string;
}

export interface ResourceMeta {
  count: number;
}

export interface ResourceLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Resource {
  meta: ResourceMeta;
  links: ResourceLinks;
  data: ResourceData[];
}

// eslint-disable-next-line no-shadow
export const enum ResourceType {
  account = 'account',
  cluster = 'cluster',
  node = 'node',
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
  awsCloud = 'aws_cloud',
  azure = 'azure',
  azureCloud = 'azure_cloud',
  gcp = 'gcp',
  ibm = 'ibm',
  ocp = 'ocp',
}
