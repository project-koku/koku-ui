import axios from 'axios';
import { Omit } from 'react-redux';

import { ReportType } from './report';
import { Report, ReportCostTypeDatum, ReportData, ReportDatum, ReportMeta, ReportValue } from './report';

export interface AzureReportValue extends ReportValue {
  instance_type?: string;
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

export interface GroupByInstanceTypeData extends Omit<AzureReportData, 'instance_types'> {
  instance_type: string;
}

export interface AzureReportData extends ReportData {
  instance_types?: GroupByInstanceTypeData[];
  resource_locations?: GroupByRegionData[];
  service_names?: GroupByServiceData[];
  subscription_guids?: GroupByAccountData[];
}

export interface AzureReportMeta extends ReportMeta {
  total?: {
    cost: ReportCostTypeDatum;
    count?: ReportDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    usage?: ReportDatum;
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
  [ReportType.tag]: 'tags/azure/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<AzureReport>(`${path}?${query}`);
}
