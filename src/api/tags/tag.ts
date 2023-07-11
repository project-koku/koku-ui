import type { PagedMetaData, PagedResponse } from 'api/api';

export interface TagData {
  enabled?: boolean;
  key?: string;
  values?: string[];
}

export interface TagMeta extends PagedMetaData {
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  filter?: {
    [filter: string]: any;
  };
}

export interface Tag extends PagedResponse<TagData, TagMeta> {}

// eslint-disable-next-line no-shadow
export const enum TagType {
  tag = 'tag',
}

// eslint-disable-next-line no-shadow
export const enum TagPathsType {
  aws = 'aws',
  awsOcp = 'aws_ocp',
  azure = 'azure',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ibm = 'ibm',
  oci = 'oci',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
  rhel = 'rhel',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  ros = 'ocp', // Todo: Remove when APIs are available
}
