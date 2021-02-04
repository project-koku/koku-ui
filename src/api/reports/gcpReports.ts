import axios from 'axios';
import { Omit } from 'react-redux';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

export interface GcpReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  project?: string;
  instance_type?: string;
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

export interface GroupByInstanceTypeData extends Omit<GcpReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByProjectData extends Omit<GcpReportData, 'projects'> {
  instance_type: string;
}

export interface GcpReportData extends ReportData {
  accounts?: GroupByAccountData[];
  instance_types?: GroupByInstanceTypeData[];
  projects?: GroupByProjectData[];
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
  return axios.get<GcpReport>(`${path}?${query}`);
}
