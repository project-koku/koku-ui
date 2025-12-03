import type { PagedMetaData, PagedResponse } from '../api';

export interface OrgData {
  accounts: string[];
  level?: number;
  org_unit_id?: string;
  org_unit_name?: string;
  org_unit_path?: string;
  sub_orgs: string[];
}

export interface OrgMeta extends PagedMetaData {
  key_only?: boolean;
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

export type Org = PagedResponse<OrgData, OrgMeta>;

export const enum OrgType {
  org = 'org',
}

export const enum OrgPathsType {
  aws = 'aws',
}
