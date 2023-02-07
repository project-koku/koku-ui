import type { PagedMetaData, PagedResponse } from 'api/api';

export interface RosValue {
  units?: string;
  value?: number;
}

export interface RosItemValue {
  markup?: RosValue;
  raw?: RosValue;
  total?: RosValue;
  usage: RosValue;
}

export interface RosItem {
  alias?: string;
  classification?: string; // Platform.
  cost?: RosItemValue;
  date?: string;
  default_project?: string; // 'True' or 'False'
  delta_percent?: number;
  delta_value?: number;
  id?: string;
  infrastructure?: RosItemValue;
  source_uuid?: string;
  supplementary?: RosItemValue;
}

// Additional props for group_by[org_unit_id]
export interface RosData {
  date?: string;
  values?: RosItem[];
}

export interface RosMeta extends PagedMetaData {
  category?: string[];
  count: number;
  delta?: {
    percent: number;
    value: number;
  };
  filter?: {
    [filter: string]: any;
  };
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  others?: number;
  total?: {
    capacity?: RosValue;
    cost?: RosItemValue;
    count?: RosValue; // Workaround for https://github.com/project-koku/koku/issues/1395
    infrastructure?: RosItemValue;
    limit?: RosValue;
    request?: RosValue;
    supplementary?: RosItemValue;
    usage?: RosValue;
  };
}

export interface Ros extends PagedResponse<RosData, RosMeta> {}

// eslint-disable-next-line no-shadow
export const enum RosType {
  cost = 'cost',
}

// eslint-disable-next-line no-shadow
export const enum RosPathsType {
  recommendation = 'recommendation',
}
