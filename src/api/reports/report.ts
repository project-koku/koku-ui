export interface ReportDatum {
  value: number;
  units: string;
}

export interface ReportCostTypeDatum {
  raw: ReportDatum;
  markup: ReportDatum;
  usage: ReportDatum;
  total: ReportDatum;
}

export interface ReportValue {
  cluster?: string;
  cost: ReportCostTypeDatum;
  count?: ReportDatum;
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  supplementary?: ReportCostTypeDatum;
  infrastructure?: ReportCostTypeDatum;
  usage?: ReportDatum;
}

export interface ReportData {
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  key?: string;
  values?: ReportValue[];
}

export interface ReportMeta {
  count: number;
  delta?: {
    percent: number;
    value: number;
  };
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  filter?: {
    [filter: string]: any;
  };
  total?: {
    cost: ReportCostTypeDatum;
    count?: ReportDatum;
    infrastructure: ReportCostTypeDatum;
    request?: ReportDatum;
    supplementary: ReportCostTypeDatum;
    usage?: ReportDatum;
  };
}

export interface ReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Report {
  meta: ReportMeta;
  links: ReportLinks;
  data: ReportData[];
}

export const enum ReportType {
  cost = 'cost',
  cpu = 'cpu',
  database = 'database',
  instanceType = 'instance_type',
  memory = 'memory',
  network = 'network',
  storage = 'storage',
  tag = 'tag',
  volume = 'volume',
}
