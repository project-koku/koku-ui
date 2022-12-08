import type { RhelFilters, RhelQuery } from 'api/queries/rhelQuery';
import { getQuery } from 'api/queries/rhelQuery';
import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const rhelDashboardStateKey = 'rhelDashboard';
export const rhelDashboardDefaultFilters: RhelFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const rhelDashboardTabFilters: RhelFilters = {
  ...rhelDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum RhelDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface RhelDashboardWidget extends DashboardWidget<RhelDashboardTab> {}

// Todo: cluster, project, node
export function getGroupByForTab(tab: RhelDashboardTab): RhelQuery['group_by'] {
  switch (tab) {
    case RhelDashboardTab.projects:
      return { project: '*' };
    case RhelDashboardTab.clusters:
      return { cluster: '*' };
    case RhelDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: RhelFilters = rhelDashboardDefaultFilters, props?) {
  const query: RhelQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: RhelDashboardWidget,
  filter: RhelFilters = rhelDashboardDefaultFilters,
  props?
) {
  const query: RhelQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
    ...(props ? props : {}),
  };
  return getQuery(query);
}
