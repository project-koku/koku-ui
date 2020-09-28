import axios from 'axios';
import { Omit } from 'react-redux';

import { Report, ReportCostTypeDatum, ReportData, ReportDatum, ReportMeta, ReportType, ReportValue } from './report';

export interface AwsCloudReportValue extends ReportValue {
  account?: string;
  account_alias?: string;
  instance_type?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<AwsCloudReportData, 'accounts'> {
  account: string;
}

export interface GroupByServiceData extends Omit<AwsCloudReportData, 'services'> {
  service: string;
}

export interface GroupByRegionData extends Omit<AwsCloudReportData, 'regions'> {
  region: string;
}

export interface GroupByInstanceTypeData extends Omit<AwsCloudReportData, 'instance_types'> {
  instance_type: string;
}

export interface AwsCloudReportData extends ReportData {
  accounts?: GroupByAccountData[];
  services?: GroupByServiceData[];
  instance_types?: GroupByInstanceTypeData[];
  regions?: GroupByRegionData[];
}

export interface AwsCloudReportMeta extends ReportMeta {
  total?: {
    cost: ReportCostTypeDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    usage?: ReportDatum;
  };
}

export interface AwsCloudReport extends Report {
  meta: AwsCloudReportMeta;
  data: AwsCloudReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/aws/costs/',
  [ReportType.database]: 'reports/openshift/infrastructures/aws/costs/',
  [ReportType.network]: 'reports/openshift/infrastructures/aws/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/aws/storage/',
  [ReportType.instanceType]: 'reports/openshift/infrastructures/aws/instance-types/',
  [ReportType.tag]: 'tags/openshift/infrastructures/aws/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<AwsCloudReport>(`${path}?${query}`);
}
