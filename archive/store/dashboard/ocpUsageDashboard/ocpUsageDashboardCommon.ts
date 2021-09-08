import { getQuery, OcpCloudFilters, OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ocpUsageDashboardStateKey = 'ocpUsageDashboard';
export const ocpUsageDashboardDefaultFilters: OcpCloudFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpUsageDashboardTabFilters: OcpCloudFilters = {
  ...ocpUsageDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum OcpUsageDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpUsageDashboardWidget extends DashboardWidget<OcpUsageDashboardTab> {}

// Todo: cluster, project, node
export function getGroupByForTab(tab: OcpUsageDashboardTab): OcpCloudQuery['group_by'] {
  switch (tab) {
    case OcpUsageDashboardTab.projects:
      return { project: '*' };
    case OcpUsageDashboardTab.clusters:
      return { cluster: '*' };
    case OcpUsageDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: OcpCloudFilters = ocpUsageDashboardDefaultFilters) {
  const query: OcpCloudQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpUsageDashboardWidget,
  filter: OcpCloudFilters = ocpUsageDashboardDefaultFilters
) {
  const query: OcpCloudQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
