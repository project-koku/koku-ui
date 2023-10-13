import type { PagedMetaData, PagedResponse } from 'api/api';

export interface ReportValue {
  count?: number;
  count_units?: string;
  units?: string;
  unused?: number;
  unused_percent?: number;
  value?: number;
}

export interface ReportItemValue {
  distributed?: ReportValue;
  markup?: ReportValue;
  platform_distributed?: ReportValue;
  raw?: ReportValue;
  total?: ReportValue;
  usage?: ReportValue;
  worker_unallocated_distributed?: ReportValue;
}

export interface ReportItem {
  classification?: string; // Platform.
  cost?: ReportItemValue;
  date?: string;
  default_project?: string; // 'True' or 'False'
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

export interface ReportGcpItem extends ReportItem {
  account?: string;
  project?: string;
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
  persistentvolumeclaim?: string;
  project?: string;
  request: ReportValue;
  usage: ReportValue;
}

export interface ReportOrgItem extends ReportItem {
  alias?: string;
  id?: string;
}

// Additional props for group_by[org_unit_id]
export interface ReportOrgData {
  id?: string;
  type?: string; // 'account' or 'organizational_unit'
}

// Additional props for group_by[org_unit_id]
export interface ReportData extends ReportOrgData {
  date?: string;
  values?: ReportAwsItem[] | ReportAzureItem[] | ReportGcpItem[] | ReportOcpItem[] | ReportOrgItem[];
}

export interface ReportMeta extends PagedMetaData {
  category?: string[];
  count: number;
  delta?: {
    percent: number;
    value: number;
  };
  distributed_overhead?: boolean;
  filter?: {
    [filter: string]: any;
  };
  group_by?: {
    [group: string]: string[];
  };
  limit?: number;
  offset?: number;
  order_by?: {
    [order: string]: string;
  };
  others?: number;
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

export interface Report extends PagedResponse<ReportData, ReportMeta> {}

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
  awsOcp = 'aws_ocp',
  azure = 'azure',
  oci = 'oci',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ibm = 'ibm',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
  rhel = 'rhel',
}
