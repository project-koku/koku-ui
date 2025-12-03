import axiosInstance from '../api';
import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface AzureOcpReportItem extends ReportItem {
  resource_location?: string;
  service_name?: string;
  subscription_guid?: string;
}

export interface GroupByAccountData extends Omit<AzureOcpReportData, 'subscription_guids'> {
  account: string;
}

export interface GroupByServiceData extends Omit<AzureOcpReportData, 'service_names'> {
  service: string;
}

export interface GroupByRegionData extends Omit<AzureOcpReportData, 'resource_locations'> {
  region: string;
}

export interface AzureOcpReportData extends ReportData {
  resource_locations?: GroupByRegionData[];
  service_names?: GroupByServiceData[];
  subscription_guids?: GroupByAccountData[];
}

export interface AzureOcpReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface AzureOcpReport extends Report {
  meta: AzureOcpReportMeta;
  data: AzureOcpReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/azure/costs/',
  [ReportType.database]: 'reports/openshift/infrastructures/azure/costs/',
  [ReportType.network]: 'reports/openshift/infrastructures/azure/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/azure/storage/',
  [ReportType.instanceType]: 'reports/openshift/infrastructures/azure/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<AzureOcpReport>(`${path}?${query}`);
}
