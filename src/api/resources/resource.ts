export interface ResourceData {
  account_alias: string;
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
  region = 'region',
  service = 'service',
}

// eslint-disable-next-line no-shadow
export const enum ResourcePathsType {
  aws = 'aws',
}
