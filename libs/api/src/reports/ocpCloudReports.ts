import axiosInstance from '../api';
import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

// Todo: Remove capacity, limit, & request?
export interface OcpCloudReportItem extends ReportItem {
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

export interface GroupByAccountData extends Omit<OcpCloudReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData extends Omit<OcpCloudReportData, 'clusters'> {
  service: string;
}

export interface GroupByNodeData extends Omit<OcpCloudReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData extends Omit<OcpCloudReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<OcpCloudReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<OcpCloudReportData, 'services'> {
  service: string;
}

export interface OcpCloudReportData extends ReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface OcpCloudReportMeta extends ReportMeta {
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

export interface OcpCloudReport extends Report {
  meta: OcpCloudReportMeta;
  data: OcpCloudReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.database]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.instanceType]: 'reports/openshift/infrastructures/all/instance-types/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.network]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/all/storage/',
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<OcpCloudReport>(`${path}?${query}`);
}
