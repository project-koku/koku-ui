import axios from 'axios';
import { Omit } from 'react-redux';

export interface ReportValue {
  date: string;
  total: number;
  units: string;
  account?: string;
  count?: number;
  instance_type?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<ReportData, 'accounts'> {
  account: string;
}

export interface GroupByServiceData extends Omit<ReportData, 'services'> {
  service: string;
}

export interface GroupByInstanceTypeData
  extends Omit<ReportData, 'instance_types'> {
  instance_type: string;
}

export interface ReportData {
  date?: string;
  services?: GroupByServiceData[];
  accounts?: GroupByAccountData[];
  instance_types: GroupByInstanceTypeData[];
  values?: ReportValue[];
}

export interface Report {
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  filter?: {
    [filter: string]: any;
  };
  data: ReportData[];
  total: {
    units: string;
    value: number;
  };
}

export const enum ReportType {
  cost = 'cost',
}

const reportTypePaths: Record<ReportType, string> = {
  [ReportType.cost]: 'reports/costs/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = reportTypePaths[reportType];
  return axios.get<Report>(`${path}?${query}`);
}
