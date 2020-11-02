import axios from 'axios';
import { Omit } from 'react-redux';

import { Report, ReportCostTypeDatum, ReportData, ReportDatum, ReportMeta, ReportType, ReportValue } from './report';

export interface GcpReportValue extends ReportValue {
  account?: string;
  account_alias?: string;
  instance_type?: string;
  org_unit_id?: string;
  region?: string;
  service?: string;
}

export interface GroupByAccountData extends Omit<GcpReportData, 'accounts'> {
  account: string;
}

export interface GroupByRegionData extends Omit<GcpReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData extends Omit<GcpReportData, 'services'> {
  service: string;
}

export interface GroupByInstanceTypeData extends Omit<GcpReportData, 'instance_types'> {
  instance_type: string;
}

export interface GcpReportData extends ReportData {
  accounts?: GroupByAccountData[];
  instance_types?: GroupByInstanceTypeData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface GcpReportMeta extends ReportMeta {
  total?: {
    cost: ReportCostTypeDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    usage?: ReportDatum;
  };
}

export interface GcpReport extends Report {
  meta: GcpReportMeta;
  data: GcpReportData[];
}

// Todo: future work to utilize 'dcp' once backend APIs are providd
export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/aws/costs/',
  [ReportType.database]: 'reports/aws/costs/',
  [ReportType.network]: 'reports/aws/costs/',
  [ReportType.org]: 'organizations/aws/',
  [ReportType.storage]: 'reports/aws/storage/',
  [ReportType.instanceType]: 'reports/aws/instance-types/',
  [ReportType.tag]: 'tags/aws/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<GcpReport>(`${path}?${query}`);
}
