import axios from 'axios';
import { Omit } from 'react-redux';

import { ReportType } from './report';
import { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';

export interface OciReportItem extends ReportItem {
  resource_location?: string;
  service_name?: string;
  subscription_guid?: string;
}

export interface GroupByAccountData extends Omit<OciReportData, 'subscription_guids'> {
  account: string;
}

export interface GroupByServiceData extends Omit<OciReportData, 'service_names'> {
  service: string;
}

export interface GroupByRegionData extends Omit<OciReportData, 'resource_locations'> {
  region: string;
}

export interface OciReportData extends ReportData {
  resource_locations?: GroupByRegionData[];
  service_names?: GroupByServiceData[];
  subscription_guids?: GroupByAccountData[];
}

export interface OciReportMeta extends ReportMeta {
  total?: {
    cost?: ReportItemValue;
    count?: ReportValue; // Workaround for https://github.com/project-koku/koku/issues/1395
    infrastructure?: ReportItemValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface OciReport extends Report {
  meta: OciReportMeta;
  data: OciReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/oci/costs/',
  [ReportType.database]: 'reports/oci/costs/',
  [ReportType.network]: 'reports/oci/costs/',
  [ReportType.storage]: 'reports/oci/storage/',
  [ReportType.instanceType]: 'reports/oci/instance-types/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<OciReport>(`${path}?${query}`);
}
