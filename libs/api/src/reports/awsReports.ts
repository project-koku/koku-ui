import axiosInstance from '../api';
import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface AwsReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  aws_category?: string;
  org_unit_id?: string;
  region?: string;
  resource_id?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<AwsReportData, 'accounts'> {
  account: string;
}

export interface GroupByRegionData extends Omit<AwsReportData, 'regions'> {
  region: string;
}

export interface GroupByResourceData extends Omit<AwsReportData, 'resource_ids'> {
  resource_id: string;
}

export interface GroupByServiceData extends Omit<AwsReportData, 'services'> {
  service: string;
}

export interface AwsReportData extends ReportData {
  accounts?: GroupByAccountData[];
  regions?: GroupByRegionData[];
  resource_ids?: GroupByResourceData[];
  services?: GroupByServiceData[];
}

export interface AwsReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
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
  [ReportType.ec2Compute]: 'reports/aws/resources/ec2-compute/',
  [ReportType.storage]: 'reports/aws/storage/',
  [ReportType.instanceType]: 'reports/aws/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];

  // For use with API development -- see 'api/apiDev'
  // if (reportType === ReportType.ec2Compute) {
  //   return devAxiosInstance.get<AwsReport>(`${path}?${query}`);
  // }
  return axiosInstance.get<AwsReport>(`${path}?${query}`);
}
