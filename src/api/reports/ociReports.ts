import axios from 'axios';

import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface OciReportItem extends ReportItem {
  region?: string;
  product_service?: string;
  payer_tenant_id?: string;
}

export interface GroupByAccountData extends Omit<OciReportData, 'payer_tenant_ids'> {
  account: string;
}

export interface GroupByServiceData extends Omit<OciReportData, 'product_services'> {
  service: string;
}

export interface GroupByRegionData extends Omit<OciReportData, 'regions'> {
  region: string;
}

export interface OciReportData extends ReportData {
  regions?: GroupByRegionData[];
  product_services?: GroupByServiceData[];
  payer_tenant_ids?: GroupByAccountData[];
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
