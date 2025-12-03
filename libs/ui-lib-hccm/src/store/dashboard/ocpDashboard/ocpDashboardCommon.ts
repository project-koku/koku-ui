import type { OcpFilters, OcpQuery } from '@koku-ui/api/queries/ocpQuery';
import { getQuery } from '@koku-ui/api/queries/ocpQuery';

import type { DashboardWidget } from '../common/dashboardCommon';

export const ocpDashboardStateKey = 'ocpDashboard';
export const ocpDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpDashboardTabFilters: OcpFilters = {
  ...ocpDashboardDefaultFilters,
  limit: 3,
};

export const enum OcpDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

// Todo: cluster, project, node
export function getGroupByForTab(tab: OcpDashboardTab): OcpQuery['group_by'] {
  switch (tab) {
    case OcpDashboardTab.projects:
      return { project: '*' };
    case OcpDashboardTab.clusters:
      return { cluster: '*' };
    case OcpDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: any = ocpDashboardDefaultFilters, props?) {
  const query: OcpQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: DashboardWidget,
  filter: OcpFilters = ocpDashboardDefaultFilters,
  props?
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
    ...(props ? props : {}),
  };
  return getQuery(query);
}
