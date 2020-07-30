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
  key?: string; // tags
  level?: number; // org units
  type?: string // account or organizational_unit
  values?: ReportValue[]; // tags
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
    capacity?: ReportDatum;
    cost: ReportCostTypeDatum;
    count?: ReportDatum;
    infrastructure: ReportCostTypeDatum;
    limit?: ReportDatum;
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
  org = 'org',
  storage = 'storage',
  tag = 'tag',
  volume = 'volume',
}

export const enum ReportPathsType {
  aws = 'aws',
  awsCloud = 'aws_cloud',
  azure = 'azure',
  azureCloud = 'azure_cloud',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
  ocpUsage = 'ocp_usage',
}
