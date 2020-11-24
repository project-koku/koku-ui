import axios from 'axios';
import { Omit } from 'react-redux';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

export interface AzureCloudReportItem extends ReportItem {
  instance_type?: string;
  resource_location?: string;
  service_name?: string;
  subscription_guid?: string;
}

export interface GroupByAccountData extends Omit<AzureCloudReportData, 'subscription_guids'> {
  account: string;
}

export interface GroupByServiceData extends Omit<AzureCloudReportData, 'service_names'> {
  service: string;
}

export interface GroupByRegionData extends Omit<AzureCloudReportData, 'resource_locations'> {
  region: string;
}

export interface GroupByInstanceTypeData extends Omit<AzureCloudReportData, 'instance_types'> {
  instance_type: string;
}

export interface AzureCloudReportData extends ReportData {
  instance_types?: GroupByInstanceTypeData[];
  resource_locations?: GroupByRegionData[];
  service_names?: GroupByServiceData[];
  subscription_guids?: GroupByAccountData[];
}

export interface AzureCloudReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface AzureCloudReport extends Report {
  meta: AzureCloudReportMeta;
  data: AzureCloudReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/azure/costs/',
  [ReportType.database]: 'reports/openshift/infrastructures/azure/costs/',
  [ReportType.network]: 'reports/openshift/infrastructures/azure/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/azure/storage/',
  [ReportType.instanceType]: 'reports/openshift/infrastructures/azure/instance-types/',
  [ReportType.tag]: 'tags/openshift/infrastructures/azure/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<AzureCloudReport>(`${path}?${query}`);
}
