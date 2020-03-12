import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportValue,
} from './report';

// Todo: Remove capacity, limit, & request?
export interface OcpCloudReportValue extends ReportValue {
  account?: string;
  account_alias?: string;
  capacity?: ReportDatum;
  cluster?: string;
  clusters?: string[];
  instance_type?: string;
  limit?: ReportDatum;
  markup_cost: ReportDatum;
  node?: string;
  project?: string;
  region?: string;
  request?: ReportDatum;
  service?: string;
}

export interface GroupByAccountData
  extends Omit<OcpCloudReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData
  extends Omit<OcpCloudReportData, 'clusters'> {
  service: string;
}

export interface GroupByInstanceTypeData
  extends Omit<OcpCloudReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByNodeData extends Omit<OcpCloudReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpCloudReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<OcpCloudReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData
  extends Omit<OcpCloudReportData, 'services'> {
  service: string;
}

export interface OcpCloudReportData extends ReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  instance_types?: GroupByInstanceTypeData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface OcpCloudReportMeta extends ReportMeta {
  total?: {
    capacity?: ReportDatum;
    cost: ReportDatum;
    derived_cost: ReportDatum;
    infrastructure_cost: ReportDatum;
    limit?: ReportDatum;
    markup_cost?: ReportDatum;
    request?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface OcpCloudReport extends Report {
  meta: OcpCloudReportMeta;
  data: OcpCloudReportData[];
}

export const enum OcpCloudReportType {
  cost = 'cost',
  cpu = 'cpu',
  database = 'database',
  instanceType = 'instance_type',
  memory = 'memory',
  network = 'network',
  storage = 'storage',
  tag = 'tag',
  volume = 'volume',
}

export const OcpCloudReportTypePaths: Record<OcpCloudReportType, string> = {
  [OcpCloudReportType.cost]: 'reports/openshift/infrastructures/all/costs/',
  [OcpCloudReportType.cpu]: 'reports/openshift/compute/',
  [OcpCloudReportType.database]: 'reports/openshift/infrastructures/all/costs/',
  [OcpCloudReportType.instanceType]:
    'reports/openshift/infrastructures/all/instance-types/',
  [OcpCloudReportType.memory]: 'reports/openshift/memory/',
  [OcpCloudReportType.network]: 'reports/openshift/infrastructures/all/costs/',
  [OcpCloudReportType.storage]:
    'reports/openshift/infrastructures/all/storage/',
  [OcpCloudReportType.tag]: 'tags/openshift/infrastructures/all/',
  [OcpCloudReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: OcpCloudReportType, query: string) {
  const path = OcpCloudReportTypePaths[reportType];
  return axios.get<OcpCloudReport>(`${path}?${query}`);
}
