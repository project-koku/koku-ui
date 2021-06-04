export interface TagData {
  enabled?: boolean;
  key?: string;
  values?: string[];
}

export interface TagMeta {
  count: number;
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

export interface TagLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Tag {
  data: TagData[];
  links?: TagLinks;
  meta: TagMeta;
}

// eslint-disable-next-line no-shadow
export const enum TagType {
  tag = 'tag',
}

// eslint-disable-next-line no-shadow
export const enum TagPathsType {
  aws = 'aws',
  awsCloud = 'aws_cloud',
  azure = 'azure',
  azureCloud = 'azure_cloud',
  gcp = 'gcp',
  ibm = 'gcp', // Todo: update to use ibm backend apis when they become available
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
}
