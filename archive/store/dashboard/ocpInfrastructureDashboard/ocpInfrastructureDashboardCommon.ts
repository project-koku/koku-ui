import { getQuery, OcpFilters, OcpQuery } from 'api/queries/ocpQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ocpInfrastructureDashboardStateKey = 'ocpInfrastructureDashboard';
export const ocpInfrastructureDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpInfrastructureDashboardTabFilters: OcpFilters = {
  ...ocpInfrastructureDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum OcpInfrastructureDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpInfrastructureDashboardWidget extends DashboardWidget<OcpInfrastructureDashboardTab> {}

// Todo: cluster, project, node
export function getGroupByForTab(tab: OcpInfrastructureDashboardTab): OcpQuery['group_by'] {
  switch (tab) {
    case OcpInfrastructureDashboardTab.projects:
      return { project: '*' };
    case OcpInfrastructureDashboardTab.clusters:
      return { cluster: '*' };
    case OcpInfrastructureDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: OcpFilters = ocpInfrastructureDashboardDefaultFilters, props?) {
  const query: OcpQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpInfrastructureDashboardWidget,
  filter: OcpFilters = ocpInfrastructureDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
