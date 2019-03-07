import axios from 'axios';
import { Omit } from 'react-redux';

export interface AwsDatum {
  value: number;
  units: string;
}

export interface AwsReportValue {
  date: string;
  delta_percent?: number;
  delta_value?: number;
  cost: AwsDatum;
  usage?: AwsDatum;
  account?: string;
  account_alias?: string;
  count?: AwsDatum;
  instance_type?: string;
  service?: string;
  region?: string;
}

export interface GroupByAccountData extends Omit<AwsReportData, 'accounts'> {
  account: string;
}

export interface GroupByServiceData extends Omit<AwsReportData, 'services'> {
  service: string;
}

export interface GroupByRegionData extends Omit<AwsReportData, 'regions'> {
  region: string;
}

export interface GroupByInstanceTypeData
  extends Omit<AwsReportData, 'instance_types'> {
  instance_type: string;
}

export interface AwsReportData {
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  services?: GroupByServiceData[];
  accounts?: GroupByAccountData[];
  regions?: GroupByRegionData[];
  instance_types?: GroupByInstanceTypeData[];
  values?: AwsReportValue[];
}

export interface AwsReportMeta {
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
    usage?: AwsDatum;
    cost: AwsDatum;
  };
  count: number;
}

export interface AwsReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface AwsReport {
  meta: AwsReportMeta;
  links: AwsReportLinks;
  data: AwsReportData[];
}

export const enum AwsReportType {
  cost = 'cost',
  storage = 'storage',
  instanceType = 'instance_type',
  tag = 'tag',
}

export const awsReportTypePaths: Record<AwsReportType, string> = {
  [AwsReportType.cost]: 'reports/aws/costs/',
  [AwsReportType.storage]: 'reports/aws/storage/',
  [AwsReportType.instanceType]: 'reports/aws/instance-types/',
  [AwsReportType.tag]: 'tags/aws/',
};

export function runReport(reportType: AwsReportType, query: string) {
  const path = awsReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<AwsReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<AwsReport>(`${path}?${query}`);
  }
}
