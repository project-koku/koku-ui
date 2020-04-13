import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportCostTypeDatum,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportType,
  ReportValue,
} from './report';

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
    cost: ReportCostTypeDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    usage?: ReportDatum;
  };
}

export interface AwsReport extends Report {
  meta: AwsReportMeta;
  data: AwsReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/aws/costs/',
  [ReportType.database]: 'reports/aws/costs/',
  [ReportType.network]: 'reports/aws/costs/',
  [ReportType.storage]: 'reports/aws/storage/',
  [ReportType.instanceType]: 'reports/aws/instance-types/',
  [ReportType.tag]: 'tags/aws/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<AwsReport>(`${path}?${query}`);
}
