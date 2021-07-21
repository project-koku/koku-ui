import axios from 'axios';
import { Omit } from 'react-redux';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

export interface AwsOcpReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  instance_type?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<AwsOcpReportData, 'accounts'> {
  account: string;
}

export interface GroupByServiceData extends Omit<AwsOcpReportData, 'services'> {
  service: string;
}

export interface GroupByRegionData extends Omit<AwsOcpReportData, 'regions'> {
  region: string;
}

export interface GroupByInstanceTypeData extends Omit<AwsOcpReportData, 'instance_types'> {
  instance_type: string;
}

export interface AwsOcpReportData extends ReportData {
  accounts?: GroupByAccountData[];
  services?: GroupByServiceData[];
  instance_types?: GroupByInstanceTypeData[];
  regions?: GroupByRegionData[];
}

export interface AwsOcpReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface AwsOcpReport extends Report {
  meta: AwsOcpReportMeta;
  data: AwsOcpReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/aws/costs/',
  [ReportType.database]: 'reports/openshift/infrastructures/aws/costs/',
  [ReportType.network]: 'reports/openshift/infrastructures/aws/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/aws/storage/',
  [ReportType.instanceType]: 'reports/openshift/infrastructures/aws/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<AwsOcpReport>(`${path}?${query}`);
}
