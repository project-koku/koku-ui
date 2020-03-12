import {
  getQuery,
  OcpCloudFilters,
  OcpCloudQuery,
} from 'api/queries/ocpCloudQuery';
import { OcpCloudReportType } from 'api/reports/ocpCloudReports';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ocpCloudDashboardStateKey = 'ocpCloudDashboard';
export const ocpCloudDashboardDefaultFilters: OcpCloudFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpCloudDashboardTabFilters: OcpCloudFilters = {
  ...ocpCloudDashboardDefaultFilters,
  limit: 3,
};

export const enum OcpCloudDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpCloudDashboardWidget
  extends DashboardWidget<OcpCloudReportType, OcpCloudDashboardTab> {}

// Todo: cluster, project, node
export function getGroupByForTab(
  tab: OcpCloudDashboardTab
): OcpCloudQuery['group_by'] {
  switch (tab) {
    case OcpCloudDashboardTab.projects:
      return { project: '*' };
    case OcpCloudDashboardTab.clusters:
      return { cluster: '*' };
    case OcpCloudDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters
) {
  const query: OcpCloudQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpCloudDashboardWidget,
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters
) {
  const query: OcpCloudQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
