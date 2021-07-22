import { PagedMetaData, PagedResponse } from 'api/api';

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
  ibm = 'gcp', // Todo: update to use ibm backend apis when they become available
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
}
