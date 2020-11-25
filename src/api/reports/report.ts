export interface ReportValue {
  units?: string;
  value?: number;
}

export interface ReportItemValue {
  markup?: ReportValue;
  raw?: ReportValue;
  total?: ReportValue;
  usage: ReportValue;
}

export interface ReportItem {
  cost?: ReportItemValue;
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  infrastructure?: ReportItemValue;
  source_uuid?: string;
  supplementary?: ReportItemValue;
}

export interface ReportAwsItem extends ReportItem {
  account?: string;
  account_alias?: string;
  region?: string;
  service?: string;
}

export interface ReportAzureItem extends ReportItem {
  resource_location?: string; // 'region'
  service_name?: string; // 'service'
  subscription_guid?: string; // 'account'
}

export interface ReportOcpItem extends ReportItem {
  capacity: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit: ReportValue;
  node?: string;
  project?: string;
  request: ReportValue;
  usage: ReportValue;
}

export interface ReportOrgItem extends ReportItem {
  alias?: string;
  id?: string;
}

export interface ReportOrgData {
  id?: string;
  level?: number;
  org_unit_id?: string;
  type?: string; // 'account' or 'organizational_unit'
}

export interface ReportData extends ReportOrgData {
  date?: string;
  values?: ReportAwsItem[] | ReportAzureItem[] | ReportOcpItem[] | ReportOrgItem[];
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
    capacity?: ReportValue;
    cost?: ReportItemValue;
    count?: ReportValue; // Workaround for https://github.com/project-koku/koku/issues/1395
    infrastructure?: ReportItemValue;
    limit?: ReportValue;
    request?: ReportValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface ReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Report {
  data: ReportData[];
  links?: ReportLinks;
  meta: ReportMeta;
}

// eslint-disable-next-line no-shadow
export const enum ReportType {
  cost = 'cost',
  cpu = 'cpu',
  database = 'database',
  instanceType = 'instance_type',
  memory = 'memory',
  network = 'network',
  org = 'org',
  storage = 'storage',
  volume = 'volume',
}

// eslint-disable-next-line no-shadow
export const enum ReportPathsType {
  aws = 'aws',
  awsCloud = 'aws_cloud',
  azure = 'azure',
  azureCloud = 'azure_cloud',
  gcp = 'gcp',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
  ocpUsage = 'ocp_usage',
}
