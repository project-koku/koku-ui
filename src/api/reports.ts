import axios from 'axios';
import { Omit } from 'react-redux';

export interface ReportValue {
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

export interface GroupByAccountData extends Omit<ReportData, 'accounts'> {
  account: string;
}

export interface GroupByServiceData extends Omit<ReportData, 'services'> {
  service: string;
}

export interface GroupByRegionData extends Omit<ReportData, 'regions'> {
  region: string;
}

export interface GroupByInstanceTypeData
  extends Omit<ReportData, 'instance_types'> {
  instance_type: string;
}

export interface ReportData {
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  services?: GroupByServiceData[];
  accounts?: GroupByAccountData[];
  regions?: GroupByRegionData[];
  instance_types?: GroupByInstanceTypeData[];
  values?: ReportValue[];
}

export interface Report {
  data: ReportData[];
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

export const enum ReportType {
  cost = 'cost',
  storage = 'storage',
  instanceType = 'instance_type',
}

export const reportTypePaths: Record<ReportType, string> = {
  [ReportType.cost]: 'reports/costs/aws/',
  [ReportType.storage]: 'reports/inventory/aws/storage/',
  [ReportType.instanceType]: 'reports/inventory/aws/instance-type/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = reportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Report>(`${path}?${query}`);
    });
  } else {
    return axios.get<Report>(`${path}?${query}`);
  }
}
