export interface OrgData {
  accounts: string[];
  level?: number;
  org_unit_id?: string;
  org_unit_name?: string;
  org_unit_path?: string;
  sub_orgs: string[];
}

export interface OrgMeta {
  count: number;
  key_only: boolean;
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

export interface OrgLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Org {
  data: OrgData[];
  links?: OrgLinks;
  meta: OrgMeta;
}

// eslint-disable-next-line no-shadow
export const enum OrgType {
  org = 'org',
}

// eslint-disable-next-line no-shadow
export const enum OrgPathsType {
  aws = 'aws',
}
