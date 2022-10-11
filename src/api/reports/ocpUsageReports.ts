import axios from 'axios';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

// Todo: Remove capacity, limit, & request?
export interface OcpUsageReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  capacity?: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit?: ReportValue;
  node?: string;
  project?: string;
  region?: string;
  request?: ReportValue;
  service?: string;
}

export interface GroupByAccountData extends Omit<OcpUsageReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData extends Omit<OcpUsageReportData, 'clusters'> {
  service: string;
}

export interface GroupByNodeData extends Omit<OcpUsageReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData extends Omit<OcpUsageReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<OcpUsageReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<OcpUsageReportData, 'services'> {
  service: string;
}

export interface OcpUsageReportData extends ReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface OcpUsageReportMeta extends ReportMeta {
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

export interface OcpUsageReport extends Report {
  meta: OcpUsageReportMeta;
  data: OcpUsageReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<OcpUsageReport>(`${path}?${query}`);
}
