import { getQuery, OcpFilters, OcpQuery } from 'api/queries/ocpQuery';
import { ReportType } from 'api/reports/report';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ocpSupplementaryDashboardStateKey = 'ocpSupplementaryDashboard';
export const ocpSupplementaryDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpSupplementaryDashboardTabFilters: OcpFilters = {
  ...ocpSupplementaryDashboardDefaultFilters,
  limit: 3,
};

export const enum OcpSupplementaryDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpSupplementaryDashboardWidget
  extends DashboardWidget<ReportType, OcpSupplementaryDashboardTab> {}

// Todo: cluster, project, node
export function getGroupByForTab(
  tab: OcpSupplementaryDashboardTab
): OcpQuery['group_by'] {
  switch (tab) {
    case OcpSupplementaryDashboardTab.projects:
      return { project: '*' };
    case OcpSupplementaryDashboardTab.clusters:
      return { cluster: '*' };
    case OcpSupplementaryDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpFilters = ocpSupplementaryDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpSupplementaryDashboardWidget,
  filter: OcpFilters = ocpSupplementaryDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
