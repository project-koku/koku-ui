import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpReportValue {
  date: string;
  delta_percent?: number;
  delta_value?: number;
  total: number;
  units: string;
  account?: string;
  account_alias?: string;
  count?: number;
  instance_type?: string;
  service?: string;
  region?: string;
}

export interface GroupByAccountData extends Omit<OcpReportData, 'accounts'> {
  account: string;
}

export interface GroupByServiceData extends Omit<OcpReportData, 'services'> {
  service: string;
}

export interface GroupByRegionData extends Omit<OcpReportData, 'regions'> {
  region: string;
}

export interface GroupByInstanceTypeData
  extends Omit<OcpReportData, 'instance_types'> {
  instance_type: string;
}

export interface OcpReportData {
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  services?: GroupByServiceData[];
  accounts?: GroupByAccountData[];
  regions?: GroupByRegionData[];
  instance_types?: GroupByInstanceTypeData[];
  values?: OcpReportValue[];
}

export interface OcpReport {
  data: OcpReportData[];
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
    units?: string;
    value: number;
  };
}

export const enum OcpReportType {
  cost = 'cost',
  storage = 'storage',
  instanceType = 'instance_type',
}

// Todo: use ocp API
export const ocpReportTypePaths: Record<OcpReportType, string> = {
  [OcpReportType.cost]: 'reports/costs/aws/',
  [OcpReportType.storage]: 'reports/inventory/aws/storage/',
  [OcpReportType.instanceType]: 'reports/inventory/aws/instance-type/',
};

export function runReport(reportType: OcpReportType, query: string) {
  const path = ocpReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<OcpReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<OcpReport>(`${path}?${query}`);
  }
}
