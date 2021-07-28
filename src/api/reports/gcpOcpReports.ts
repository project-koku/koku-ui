import axios from 'axios';
import { Omit } from 'react-redux';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

export interface GcpOcpReportItem extends ReportItem {
  account?: string;
  project?: string;
  instance_type?: string;
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

export interface GroupByInstanceTypeData extends Omit<GcpOcpReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByProjectData extends Omit<GcpOcpReportData, 'projects'> {
  project: string;
}

export interface GcpOcpReportData extends ReportData {
  accounts?: GroupByAccountData[];
  instance_types?: GroupByInstanceTypeData[];
  projects?: GroupByProjectData[];
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
  [ReportType.cost]: 'reports/gcp/costs/',
  [ReportType.database]: 'reports/gcp/costs/',
  [ReportType.network]: 'reports/gcp/costs/',
  [ReportType.storage]: 'reports/gcp/storage/',
  [ReportType.instanceType]: 'reports/gcp/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<GcpOcpReport>(`${path}?${query}`);
}
