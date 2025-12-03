import axiosInstance from '../api';
import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface GcpReportItem extends ReportItem {
  account?: string;
  gcp_project?: string;
  project?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<GcpReportData, 'accounts'> {
  account: string;
}

export interface GroupByRegionData extends Omit<GcpReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<GcpReportData, 'services'> {
  service: string;
}

export interface GroupByGcpProjectData extends Omit<GcpReportData, 'gcp_projects'> {
  gcp_project: string;
}

export interface GcpReportData extends ReportData {
  accounts?: GroupByAccountData[];
  gcp_projects?: GroupByGcpProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface GcpReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface GcpReport extends Report {
  meta: GcpReportMeta;
  data: GcpReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/gcp/costs/',
  [ReportType.database]: 'reports/gcp/costs/',
  [ReportType.network]: 'reports/gcp/costs/',
  [ReportType.storage]: 'reports/gcp/storage/',
  [ReportType.instanceType]: 'reports/gcp/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<GcpReport>(`${path}?${query}`);
}
