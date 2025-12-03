import type { PagedMetaData, PagedResponse } from '../api';

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

export type Tag = PagedResponse<TagData, TagMeta>;

export const enum TagType {
  tag = 'tag',
}

export const enum TagPathsType {
  aws = 'aws',
  awsOcp = 'aws_ocp',
  azure = 'azure',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
}
