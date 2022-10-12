import axios from 'axios';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

export interface IbmReportItem extends ReportItem {
  account?: string;
  project?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<IbmReportData, 'accounts'> {
  account: string;
}

export interface GroupByRegionData extends Omit<IbmReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<IbmReportData, 'services'> {
  service: string;
}

export interface GroupByProjectData extends Omit<IbmReportData, 'projects'> {
  project: string;
}

export interface IbmReportData extends ReportData {
  accounts?: GroupByAccountData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface IbmReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface IbmReport extends Report {
  meta: IbmReportMeta;
  data: IbmReportData[];
}

// Todo: update to use ibm backend apis when they become available
export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/gcp/costs/',
  [ReportType.database]: 'reports/gcp/costs/',
  [ReportType.network]: 'reports/gcp/costs/',
  [ReportType.storage]: 'reports/gcp/storage/',
  [ReportType.instanceType]: 'reports/gcp/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<IbmReport>(`${path}?${query}`);
}
