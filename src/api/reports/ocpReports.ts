import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportCostTypeDatum,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportType,
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
    limit?: ReportDatum;
    request?: ReportDatum;
    supplementary: ReportCostTypeDatum;
    usage?: ReportDatum;
  };
}

export interface OcpReport extends Report {
  meta: OcpReportMeta;
  data: OcpReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.tag]: 'tags/openshift/',
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<OcpReport>(`${path}?${query}`);
}
