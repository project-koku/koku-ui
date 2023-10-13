import axios from 'axios';

import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface OcpReportItem extends ReportItem {
  capacity?: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit?: ReportValue;
  node?: string;
  persistent_volume_claim?: string;
  project?: string;
  request?: ReportValue;
  storage_class?: string;
  usage?: ReportValue;
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

export interface GroupByPvcData extends Omit<OcpReportData, 'persistentvolumeclaims'> {
  // TBD...
}

export interface OcpReportData extends ReportData {
  cluster_alias?: string;
  clusters?: GroupByClusterData[];
  nodes?: GroupByNodeData[];
  persistentvolumeclaims?: GroupByPvcData[];
  projects?: GroupByProjectData[];
}

export interface OcpReportMeta extends ReportMeta {
  total?: {
    capacity?: ReportValue;
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    limit?: ReportValue;
    request?: ReportValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
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
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<OcpReport>(`${path}?${query}`);
}
