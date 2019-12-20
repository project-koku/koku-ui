import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpOnCloudDatum {
  value: number;
  units: string;
}

// Todo: Remove capacity, limit, & request?
export interface OcpOnCloudReportValue {
  account?: string;
  account_alias?: string;
  capacity?: OcpOnCloudDatum;
  cluster?: string;
  cluster_alias?: string;
  cost?: OcpOnCloudDatum;
  count?: OcpOnCloudDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  derived_cost: OcpOnCloudDatum;
  infrastructure_cost: OcpOnCloudDatum;
  instance_type?: string;
  limit?: OcpOnCloudDatum;
  node?: string;
  project?: string;
  region?: string;
  request?: OcpOnCloudDatum;
  service?: string;
  usage: OcpOnCloudDatum;
}

export interface GroupByAccountData
  extends Omit<OcpOnCloudReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData
  extends Omit<OcpOnCloudReportData, 'clusters'> {
  service: string;
}

export interface GroupByInstanceTypeData
  extends Omit<OcpOnCloudReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByNodeData extends Omit<OcpOnCloudReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpOnCloudReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData
  extends Omit<OcpOnCloudReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData
  extends Omit<OcpOnCloudReportData, 'services'> {
  service: string;
}

export interface OcpOnCloudReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  instance_types?: GroupByInstanceTypeData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
  values?: OcpOnCloudReportValue[];
}

export interface OcpOnCloudReportMeta {
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
    capacity?: OcpOnCloudDatum;
    cost: OcpOnCloudDatum;
    derived_cost: OcpOnCloudDatum;
    infrastructure_cost: OcpOnCloudDatum;
    limit?: OcpOnCloudDatum;
    request?: OcpOnCloudDatum;
    usage?: OcpOnCloudDatum;
  };
  count: number;
}

export interface OcpOnCloudReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface OcpOnCloudReport {
  meta: OcpOnCloudReportMeta;
  links: OcpOnCloudReportLinks;
  data: OcpOnCloudReportData[];
}

export const enum OcpOnCloudReportType {
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

export const OcpOnCloudReportTypePaths: Record<OcpOnCloudReportType, string> = {
  [OcpOnCloudReportType.cost]: 'reports/openshift/infrastructures/all/costs/',
  [OcpOnCloudReportType.cpu]: 'reports/openshift/compute/',
  [OcpOnCloudReportType.database]:
    'reports/openshift/infrastructures/all/costs/',
  [OcpOnCloudReportType.instanceType]:
    'reports/openshift/infrastructures/all/instance-types/',
  [OcpOnCloudReportType.memory]: 'reports/openshift/memory/',
  [OcpOnCloudReportType.network]:
    'reports/openshift/infrastructures/all/costs/',
  [OcpOnCloudReportType.storage]:
    'reports/openshift/infrastructures/all/storage/',
  [OcpOnCloudReportType.tag]: 'tags/openshift/infrastructures/all/',
  [OcpOnCloudReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: OcpOnCloudReportType, query: string) {
  const path = OcpOnCloudReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<OcpOnCloudReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<OcpOnCloudReport>(`${path}?${query}`);
  }
}
