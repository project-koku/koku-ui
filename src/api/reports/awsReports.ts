import axios from 'axios';

import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface AwsReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
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

export interface AwsReportData extends ReportData {
  accounts?: GroupByAccountData[];
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
  const fetch = () => axios.get<AwsReport>(`${path}?${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
