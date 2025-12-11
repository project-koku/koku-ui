import { axiosInstance } from 'api';

import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface OcpReportItem extends ReportItem {
  capacity?: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit?: ReportValue;
  node?: string;
  persistent_volume_claim?: string;
  project?: string;
  request?: ReportValue;
  storage_class?: string;
  usage?: ReportValue;
  vm_name?: string;
}

export interface GroupByClusterData extends Omit<OcpReportData, 'clusters'> {
  service: string;
}

export type GroupByGpuData = Omit<OcpReportData, 'gpus'>;

export interface GroupByNodeData extends Omit<OcpReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData extends Omit<OcpReportData, 'projects'> {
  account: string;
}

export type GroupByPvcData = Omit<OcpReportData, 'persistentvolumeclaims'>;

export type GroupByVmNameData = Omit<OcpReportData, 'vm_name'>;

export interface OcpReportData extends ReportData {
  cluster_alias?: string;
  clusters?: GroupByClusterData[];
  gpus?: GroupByGpuData[];
  nodes?: GroupByNodeData[];
  persistentvolumeclaims?: GroupByPvcData[];
  projects?: GroupByProjectData[];
  vm_names?: GroupByVmNameData[];
}

export interface OcpReportMeta extends ReportMeta {
  total?: {
    capacity?: ReportValue;
    cost?: ReportItemValue;
    infrastructure?: ReportItemValue;
    limit?: ReportValue;
    request?: ReportValue;
    supplementary?: ReportItemValue;
    usage?: ReportValue;
  };
}

export interface OcpReport extends Report {
  meta: OcpReportMeta;
  data: OcpReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.gpu]: 'reports/openshift/gpu/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.network]: 'reports/openshift/network/',
  [ReportType.volume]: 'reports/openshift/volumes/',
  [ReportType.virtualization]: 'reports/openshift/resources/virtual-machines/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<OcpReport>(`${path}?${query}`);
}
