import axios from 'axios';

import type { Report, ReportData, ReportItem, ReportItemValue, ReportMeta, ReportValue } from './report';
import { ReportType } from './report';

export interface RhelReportItem extends ReportItem {
  capacity?: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit?: ReportValue;
  node?: string;
  project?: string;
  request?: ReportValue;
}

export interface GroupByClusterData extends Omit<RhelReportData, 'clusters'> {
  service: string;
}

export interface GroupByNodeData extends Omit<RhelReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData extends Omit<RhelReportData, 'projects'> {
  account: string;
}

export interface RhelReportData extends ReportData {
  clusters?: GroupByClusterData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
}

export interface RhelReportMeta extends ReportMeta {
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

export interface RhelReport extends Report {
  meta: RhelReportMeta;
  data: RhelReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  const fetch = () => axios.get<RhelReport>(`${path}?${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
