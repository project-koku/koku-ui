import axiosInstance from '../api';
import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface AzureReportItem extends ReportItem {
  resource_location?: string;
  service_name?: string;
  subscription_guid?: string;
}

export interface GroupByAccountData extends Omit<AzureReportData, 'subscription_guids'> {
  account: string;
}

export interface GroupByServiceData extends Omit<AzureReportData, 'service_names'> {
  service: string;
}

export interface GroupByRegionData extends Omit<AzureReportData, 'resource_locations'> {
  region: string;
}

export interface AzureReportData extends ReportData {
  resource_locations?: GroupByRegionData[];
  service_names?: GroupByServiceData[];
  subscription_guids?: GroupByAccountData[];
}

export interface AzureReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    count?: ReportValue; // Workaround for https://github.com/project-koku/koku/issues/1395
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface AzureReport extends Report {
  meta: AzureReportMeta;
  data: AzureReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/azure/costs/',
  [ReportType.database]: 'reports/azure/costs/',
  [ReportType.network]: 'reports/azure/costs/',
  [ReportType.storage]: 'reports/azure/storage/',
  [ReportType.instanceType]: 'reports/azure/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<AzureReport>(`${path}?${query}`);
}
