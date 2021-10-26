import axios from 'axios';
import { Omit } from 'react-redux';
import { getCostType } from 'utils/localStorage';

import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportType, ReportValue } from './report';

export interface AwsReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  instance_type?: string;
  org_unit_id?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<AwsReportData, 'accounts'> {
  account: string;
}

export interface GroupByRegionData extends Omit<AwsReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<AwsReportData, 'services'> {
  service: string;
}

export interface GroupByInstanceTypeData extends Omit<AwsReportData, 'instance_types'> {
  instance_type: string;
}

export interface AwsReportData extends ReportData {
  accounts?: GroupByAccountData[];
  instance_types?: GroupByInstanceTypeData[];
  regions?: GroupByRegionData[];
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
  [ReportType.storage]: 'reports/aws/storage/',
  [ReportType.instanceType]: 'reports/aws/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];

  switch (reportType) {
    case ReportType.cost:
    case ReportType.database:
    case ReportType.network:
      return axios.get<AwsReport>(`${path}?cost_type=${getCostType()}&${query}`);
  }
  return axios.get<AwsReport>(`${path}?${query}`);
}
