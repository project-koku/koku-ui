import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpDatum {
  value: number;
  units: string;
}

export interface OcpReportValue {
  app?: string;
  capacity?: OcpDatum;
  cost?: OcpDatum;
  cluster?: string;
  cluster_alias?: string;
  count?: OcpDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
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

export interface OcpReport {
  data: OcpReportData[];
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
    cost?: OcpDatum;
    limit?: OcpDatum;
    request?: OcpDatum;
    usage?: OcpDatum;
  };
}

export const enum OcpReportType {
  charge = 'charge',
  cpu = 'cpu',
  memory = 'memory',
  tag = 'tag',
}

export const ocpReportTypePaths: Record<OcpReportType, string> = {
  [OcpReportType.charge]: 'reports/openshift/charges/',
  [OcpReportType.cpu]: 'reports/openshift/compute/',
  [OcpReportType.memory]: 'reports/openshift/memory/',
  [OcpReportType.tag]: 'tags/openshift/',
};

export function runReport(reportType: OcpReportType, query: string) {
  const path = ocpReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<OcpReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<OcpReport>(`${path}?${query}`);
  }
}
