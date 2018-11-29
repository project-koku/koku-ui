import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpReportValue {
  charge?: number;
  cluster?: string;
  count?: number;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  limit?: number;
  node?: string;
  project?: string;
  request?: number;
  units?: string;
  usage: number;
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
    charge?: number;
    limit?: number;
    request?: number;
    units?: string;
    usage?: number;
  };
}

export const enum OcpReportType {
  charge = 'charge',
  cpu = 'cpu',
  memory = 'memory',
}

export const ocpReportTypePaths: Record<OcpReportType, string> = {
  [OcpReportType.charge]: 'reports/charges/ocp/',
  [OcpReportType.cpu]: 'reports/inventory/ocp/cpu/',
  [OcpReportType.memory]: 'reports/inventory/ocp/memory/',
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
