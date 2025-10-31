import type { GcpFilters, GcpQuery } from 'api/queries/gcpQuery';
import { getQuery } from 'api/queries/gcpQuery';
import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const gcpDashboardStateKey = 'gcpDashboard';
export const gcpDashboardDefaultFilters: GcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const gcpDashboardTabFilters: GcpFilters = {
  ...gcpDashboardDefaultFilters,
  limit: 3,
};

export const enum GcpDashboardTab {
  accounts = 'accounts',
  gcpProjects = 'gcp_projects',
  regions = 'regions',
  services = 'services',
}

export function getGroupByForTab(widget: DashboardWidget): GcpQuery['group_by'] {
  switch (widget.currentTab) {
    case GcpDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case GcpDashboardTab.accounts:
      return { account: '*' };
    case GcpDashboardTab.gcpProjects:
      return { gcp_project: '*' };
    case GcpDashboardTab.regions:
      return { region: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: GcpFilters = gcpDashboardDefaultFilters, props?) {
  const query: GcpQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: DashboardWidget,
  filter: GcpFilters = gcpDashboardDefaultFilters,
  props?
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === GcpDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: GcpQuery = {
    filter: newFilter,
    group_by,
    ...(props ? props : {}),
  };
  return getQuery(query);
}
