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

// Todo: Remove capacity, limit, & request?
export interface OcpUsageReportValue extends ReportValue {
  account?: string;
  account_alias?: string;
  capacity?: ReportDatum;
  cluster?: string;
  clusters?: string[];
  instance_type?: string;
  limit?: ReportDatum;
  node?: string;
  project?: string;
  region?: string;
  request?: ReportDatum;
  service?: string;
}

export interface GroupByAccountData
  extends Omit<OcpUsageReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData
  extends Omit<OcpUsageReportData, 'clusters'> {
  service: string;
}

export interface GroupByInstanceTypeData
  extends Omit<OcpUsageReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByNodeData extends Omit<OcpUsageReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpUsageReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<OcpUsageReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData
  extends Omit<OcpUsageReportData, 'services'> {
  service: string;
}

export interface OcpUsageReportData extends ReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  instance_types?: GroupByInstanceTypeData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface OcpUsageReportMeta extends ReportMeta {
  total?: {
    cost: ReportCostTypeDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    capacity?: ReportDatum;
    limit?: ReportDatum;
    request?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface OcpUsageReport extends Report {
  meta: OcpUsageReportMeta;
  data: OcpUsageReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.database]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.instanceType]:
    'reports/openshift/infrastructures/all/instance-types/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.network]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/all/storage/',
  [ReportType.tag]: 'tags/openshift/infrastructures/all/',
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<OcpUsageReport>(`${path}?${query}`);
}
