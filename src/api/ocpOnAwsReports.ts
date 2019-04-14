import axios from 'axios';
import { Omit } from 'react-redux';
import { AwsReportData } from './awsReports';
import { OcpDatum } from './ocpReports';

export interface OcpOnAwsDatum {
  value: number;
  units: string;
}

// Todo: Remove capacity, limit, & request?
export interface OcpOnAwsReportValue {
  account?: string;
  account_alias?: string;
  capacity?: OcpOnAwsDatum;
  cost?: OcpOnAwsDatum;
  cluster?: string;
  cluster_alias?: string;
  count?: OcpOnAwsDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  derived_cost: OcpDatum;
  infrastructure_cost: OcpDatum;
  limit?: OcpOnAwsDatum;
  node?: string;
  project?: string;
  region?: string;
  request?: OcpOnAwsDatum;
  service?: string;
  usage: OcpOnAwsDatum;
}

export interface GroupByAccountData extends Omit<AwsReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData
  extends Omit<OcpOnAwsReportData, 'clusters'> {
  service: string;
}

export interface GroupByNodeData extends Omit<OcpOnAwsReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpOnAwsReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<AwsReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<AwsReportData, 'services'> {
  service: string;
}

export interface OcpOnAwsReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
  values?: OcpOnAwsReportValue[];
}

export interface OcpOnAwsReportMeta {
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
    capacity?: OcpOnAwsDatum;
    cost: OcpOnAwsDatum;
    derived_cost: OcpOnAwsDatum;
    infrastructure_cost: OcpOnAwsDatum;
    limit?: OcpOnAwsDatum;
    request?: OcpOnAwsDatum;
    usage?: OcpOnAwsDatum;
  };
  count: number;
}

export interface OcpOnAwsReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface OcpOnAwsReport {
  meta: OcpOnAwsReportMeta;
  links: OcpOnAwsReportLinks;
  data: OcpOnAwsReportData[];
}

export const enum OcpOnAwsReportType {
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

export const ocpOnAwsReportTypePaths: Record<OcpOnAwsReportType, string> = {
  [OcpOnAwsReportType.cost]: 'reports/openshift/infrastructures/aws/costs/',
  [OcpOnAwsReportType.cpu]: 'reports/openshift/compute/',
  [OcpOnAwsReportType.database]: 'reports/openshift/infrastructures/aws/costs/',
  [OcpOnAwsReportType.instanceType]:
    'reports/openshift/infrastructures/aws/instance-types/',
  [OcpOnAwsReportType.memory]: 'reports/openshift/memory/',
  [OcpOnAwsReportType.network]: 'reports/openshift/infrastructures/aws/costs/',
  [OcpOnAwsReportType.storage]:
    'reports/openshift/infrastructures/aws/storage/',
  [OcpOnAwsReportType.tag]: 'tags/openshift/',
  [OcpOnAwsReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: OcpOnAwsReportType, query: string) {
  const path = ocpOnAwsReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<OcpOnAwsReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<OcpOnAwsReport>(`${path}?${query}`);
  }
}
