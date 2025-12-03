import axiosInstance from '../api';
import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface GcpOcpReportItem extends ReportItem {
  account?: string;
  project?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<GcpOcpReportData, 'accounts'> {
  account: string;
}

export interface GroupByRegionData extends Omit<GcpOcpReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<GcpOcpReportData, 'services'> {
  service: string;
}

export interface GroupByProjectData extends Omit<GcpOcpReportData, 'gcp_projects'> {
  project: string;
}

export interface GcpOcpReportData extends ReportData {
  accounts?: GroupByAccountData[];
  gcp_projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface GcpOcpReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface GcpOcpReport extends Report {
  meta: GcpOcpReportMeta;
  data: GcpOcpReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/gcp/costs/',
  [ReportType.database]: 'reports/openshift/infrastructures/gcp/costs/',
  [ReportType.network]: 'reports/openshift/infrastructures/gcp/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/gcp/storage/',
  [ReportType.instanceType]: 'reports/openshift/infrastructures/gcp/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<GcpOcpReport>(`${path}?${query}`);
}
