import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportValue,
} from './report';

export interface AzureReportValue extends ReportValue {
  instance_type?: string;
  resource_location?: string;
  service_name?: string;
  subscription_guid?: string;
}

export interface GroupByAccountData
  extends Omit<AzureReportData, 'subscription_guids'> {
  account: string;
}

export interface GroupByServiceData
  extends Omit<AzureReportData, 'service_names'> {
  service: string;
}

export interface GroupByRegionData
  extends Omit<AzureReportData, 'resource_locations'> {
  region: string;
}

export interface GroupByInstanceTypeData
  extends Omit<AzureReportData, 'instance_types'> {
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
    cost: ReportDatum;
    count?: ReportDatum;
    derived_cost: ReportDatum;
    infrastructure_cost: ReportDatum;
    markup_cost?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface AzureReport extends Report {
  meta: AzureReportMeta;
  data: AzureReportData[];
}

export const enum AzureReportType {
  cost = 'cost',
  database = 'database',
  network = 'network',
  storage = 'storage',
  instanceType = 'instance_type',
  tag = 'tag',
}

export const AzureReportTypePaths: Record<AzureReportType, string> = {
  [AzureReportType.cost]: 'reports/azure/costs/',
  [AzureReportType.database]: 'reports/azure/costs/',
  [AzureReportType.network]: 'reports/azure/costs/',
  [AzureReportType.storage]: 'reports/azure/storage/',
  [AzureReportType.instanceType]: 'reports/azure/instance-types/',
  [AzureReportType.tag]: 'tags/azure/',
};

export function runReport(reportType: AzureReportType, query: string) {
  const path = AzureReportTypePaths[reportType];
  return axios.get<AzureReport>(`${path}?${query}`);
}
