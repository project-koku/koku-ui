import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportCostTypeDatum,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportValue,
} from './report';

export interface OcpReportValue extends ReportValue {
  capacity?: ReportDatum;
  cluster?: string;
  clusters?: string[];
  limit?: ReportDatum;
  node?: string;
  project?: string;
  request?: ReportDatum;
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

export interface OcpReportData extends ReportData {
  clusters?: GroupByClusterData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
}

export interface OcpReportMeta extends ReportMeta {
  total?: {
    capacity?: ReportDatum;
    cost: ReportCostTypeDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    limit?: ReportDatum;
    request?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface OcpReport extends Report {
  meta: OcpReportMeta;
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
