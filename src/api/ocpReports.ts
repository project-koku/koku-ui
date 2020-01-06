import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpDatum {
  value: number;
  units: string;
}

export interface OcpReportValue {
  capacity?: OcpDatum;
  cost?: OcpDatum;
  cluster?: string;
  cluster_alias?: string;
  count?: OcpDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  derived_cost?: OcpDatum;
  infrastructure_cost?: OcpDatum;
  limit?: OcpDatum;
  node?: string;
  project?: string;
  request?: OcpDatum;
  usage: OcpDatum;
}

export interface GroupByClusterData extends Omit<OcpReportData, 'clusters'> {
  service: string;
}

export interface GroupByNodeData extends Omit<OcpReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData extends Omit<OcpReportData, 'projects'> {
  account: string;
}

export interface OcpReportData {
  clusters?: GroupByClusterData[];
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  values?: OcpReportValue[];
}

export interface OcpReportMeta {
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
    capacity?: OcpDatum;
    cost: OcpDatum;
    derived_cost: OcpDatum;
    infrastructure_cost: OcpDatum;
    limit?: OcpDatum;
    request?: OcpDatum;
    usage?: OcpDatum;
  };
  count: number;
}

export interface OcpReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface OcpReport {
  meta: OcpReportMeta;
  links: OcpReportLinks;
  data: OcpReportData[];
}

export const enum OcpReportType {
  cost = 'cost',
  cpu = 'cpu',
  memory = 'memory',
  tag = 'tag',
  volume = 'volume',
}

export const OcpReportTypePaths: Record<OcpReportType, string> = {
  [OcpReportType.cost]: 'reports/openshift/costs/',
  [OcpReportType.cpu]: 'reports/openshift/compute/',
  [OcpReportType.memory]: 'reports/openshift/memory/',
  [OcpReportType.tag]: 'tags/openshift/',
  [OcpReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: OcpReportType, query: string) {
  const path = OcpReportTypePaths[reportType];
  return axios.get<OcpReport>(`${path}?${query}`);
}
