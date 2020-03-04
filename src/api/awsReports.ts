import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportValue,
} from './reports';

export interface AwsReportValue extends ReportValue {
  account?: string;
  account_alias?: string;
  instance_type?: string;
  region?: string;
  service?: string;
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

export interface AwsReportData extends ReportData {
  accounts?: GroupByAccountData[];
  services?: GroupByServiceData[];
  instance_types?: GroupByInstanceTypeData[];
  regions?: GroupByRegionData[];
}

export interface AwsReportMeta extends ReportMeta {
  total?: {
    cost: ReportDatum;
    derived_cost: ReportDatum;
    infrastructure_cost: ReportDatum;
    markup_cost?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface AwsReport extends Report {
  meta: AwsReportMeta;
  data: AwsReportData[];
}

export const enum AwsReportType {
  cost = 'cost',
  database = 'database',
  instanceType = 'instance_type',
  network = 'network',
  storage = 'storage',
  tag = 'tag',
}

export const AwsReportTypePaths: Record<AwsReportType, string> = {
  [AwsReportType.cost]: 'reports/aws/costs/',
  [AwsReportType.database]: 'reports/aws/costs/',
  [AwsReportType.network]: 'reports/aws/costs/',
  [AwsReportType.storage]: 'reports/aws/storage/',
  [AwsReportType.instanceType]: 'reports/aws/instance-types/',
  [AwsReportType.tag]: 'tags/aws/',
};

export function runReport(reportType: AwsReportType, query: string) {
  const path = AwsReportTypePaths[reportType];
  return axios.get<AwsReport>(`${path}?${query}`);
}
