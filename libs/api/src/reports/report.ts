import type { PagedMetaData, PagedResponse } from '../api';

export interface ReportValue {
  units?: string;
  value?: number;
}

export interface ReportUsageValue extends ReportValue {
  count?: number;
  count_units?: string;
  unused?: number;
  unused_percent?: number;
}

export interface ReportItemValue {
  credit?: ReportValue;
  distributed?: ReportValue;
  markup?: ReportValue;
  network_unattributed_distributed?: ReportValue;
  platform_distributed?: ReportValue;
  raw?: ReportValue;
  storage_unattributed_distributed?: ReportValue;
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

export interface ReportAwsInstancesItem {
  account?: string;
  account_alias?: string;
  cost?: ReportValue;
  instance_name?: string;
  instance_type?: string;
  memory?: ReportValue;
  operating_system?: string;
  region?: string;
  resource_id?: string;
  tags: [
    {
      key?: string;
      values?: string[];
      enabled?: boolean;
    },
  ];
  usage?: ReportValue;
  vcpu?: ReportValue;
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
  capacity: ReportUsageValue;
  cluster?: string;
  clusters?: string[];
  limit: ReportValue;
  node?: string;
  persistentvolumeclaim?: string;
  project?: string;
  request: ReportUsageValue;
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

export interface ReportNetworkData {
  date?: string;
  data_transfer_in?: {
    value?: number;
    units?: string;
  };
  data_transfer_out?: {
    value?: number;
    units?: string;
  };
  resource_id?: string;
  clusters?: string[];
  source_uuid?: string;
  region?: string;
}

// Additional props for group_by[org_unit_id]
export interface ReportData extends ReportOrgData {
  date?: string;
  values?:
    | ReportAwsItem[]
    | ReportAwsInstancesItem[]
    | ReportAzureItem[]
    | ReportGcpItem[]
    | ReportOcpItem[]
    | ReportOrgItem[]
    | ReportNetworkData[];
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
    capacity?: ReportUsageValue;
    cost?: ReportItemValue;
    count?: ReportValue; // Workaround for https://github.com/project-koku/koku/issues/1395
    infrastructure?: ReportItemValue;
    limit?: ReportValue;
    request?: ReportUsageValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export type Report = PagedResponse<ReportData, ReportMeta>;

export const enum ReportType {
  cost = 'cost',
  cpu = 'cpu',
  database = 'database',
  ec2Compute = 'ec2Compute',
  instanceType = 'instance_type',
  memory = 'memory',
  network = 'network',
  org = 'org',
  storage = 'storage',
  volume = 'volume',
  virtualization = 'virtualization',
}

export const enum ReportPathsType {
  aws = 'aws',
  awsOcp = 'aws_ocp',
  azure = 'azure',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
}
