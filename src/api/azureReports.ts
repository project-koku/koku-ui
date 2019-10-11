import axios from 'axios';
import { Omit } from 'react-redux';

export interface AzureDatum {
  value: number;
  units: string;
}

export interface AzureReportValue {
  subscription_guid?: string;
  cost: AzureDatum;
  count?: AzureDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  derived_cost: AzureDatum;
  infrastructure_cost: AzureDatum;
  instance_type?: string;
  resource_location?: string;
  service_name?: string;
  usage?: AzureDatum;
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

export interface AzureReportData {
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  service_names?: GroupByServiceData[];
  subscription_guids?: GroupByAccountData[];
  resource_locations?: GroupByRegionData[];
  instance_types?: GroupByInstanceTypeData[];
  values?: AzureReportValue[];
}

export interface AzureReportMeta {
  delta?: {
    percent: number;
    value: number;
  };
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  filter?: {
    [filter: string]: any;
  };
  total?: {
    cost: AzureDatum;
    derived_cost: AzureDatum;
    infrastructure_cost: AzureDatum;
    usage?: AzureDatum;
  };
  count: number;
}

export interface AzureReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface AzureReport {
  meta?: AzureReportMeta;
  links: AzureReportLinks;
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

// Todo: update for Azure
export const azureReportTypePaths: Record<AzureReportType, string> = {
  [AzureReportType.cost]: 'reports/azure/costs/',
  [AzureReportType.database]: 'reports/azure/costs/',
  [AzureReportType.network]: 'reports/azure/costs/',
  [AzureReportType.storage]: 'reports/azure/storage/',
  [AzureReportType.instanceType]: 'reports/azure/instance-types/',
  [AzureReportType.tag]: 'tags/azure/',
};

export function runReport(reportType: AzureReportType, query: string) {
  const path = azureReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<AzureReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<AzureReport>(`${path}?${query}`);
  }
}
