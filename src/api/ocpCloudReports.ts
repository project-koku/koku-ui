import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpCloudDatum {
  value: number;
  units: string;
}

// Todo: Remove capacity, limit, & request?
export interface OcpCloudReportValue {
  account?: string;
  account_alias?: string;
  capacity?: OcpCloudDatum;
  cluster?: string;
  cluster_alias?: string;
  cost?: OcpCloudDatum;
  count?: OcpCloudDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  derived_cost: OcpCloudDatum;
  infrastructure_cost: OcpCloudDatum;
  instance_type?: string;
  limit?: OcpCloudDatum;
  markup_cost: OcpCloudDatum;
  node?: string;
  project?: string;
  region?: string;
  request?: OcpCloudDatum;
  service?: string;
  tags?: string; // Todo: remove
  usage: OcpCloudDatum;
}

export interface GroupByAccountData
  extends Omit<OcpCloudReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData
  extends Omit<OcpCloudReportData, 'clusters'> {
  service: string;
}

export interface GroupByInstanceTypeData
  extends Omit<OcpCloudReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByNodeData extends Omit<OcpCloudReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpCloudReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<OcpCloudReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData
  extends Omit<OcpCloudReportData, 'services'> {
  service: string;
}

export interface OcpCloudReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  instance_types?: GroupByInstanceTypeData[];
  key?: string;
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
  values?: OcpCloudReportValue[];
}

export interface OcpCloudReportMeta {
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
    capacity?: OcpCloudDatum;
    cost: OcpCloudDatum;
    derived_cost: OcpCloudDatum;
    infrastructure_cost: OcpCloudDatum;
    limit?: OcpCloudDatum;
    markup_cost?: OcpCloudDatum;
    request?: OcpCloudDatum;
    usage?: OcpCloudDatum;
  };
  count: number;
}

export interface OcpCloudReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface OcpCloudReport {
  meta: OcpCloudReportMeta;
  links: OcpCloudReportLinks;
  data: OcpCloudReportData[];
}

export const enum OcpCloudReportType {
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

export const OcpCloudReportTypePaths: Record<OcpCloudReportType, string> = {
  [OcpCloudReportType.cost]: 'reports/openshift/infrastructures/all/costs/',
  [OcpCloudReportType.cpu]: 'reports/openshift/compute/',
  [OcpCloudReportType.database]: 'reports/openshift/infrastructures/all/costs/',
  [OcpCloudReportType.instanceType]:
    'reports/openshift/infrastructures/all/instance-types/',
  [OcpCloudReportType.memory]: 'reports/openshift/memory/',
  [OcpCloudReportType.network]: 'reports/openshift/infrastructures/all/costs/',
  [OcpCloudReportType.storage]:
    'reports/openshift/infrastructures/all/storage/',
  [OcpCloudReportType.tag]: 'tags/openshift/infrastructures/all/',
  [OcpCloudReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: OcpCloudReportType, query: string) {
  const path = OcpCloudReportTypePaths[reportType];
  return axios.get<OcpCloudReport>(`${path}?${query}`);
}
