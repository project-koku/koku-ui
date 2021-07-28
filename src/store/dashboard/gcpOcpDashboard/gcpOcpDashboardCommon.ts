import { GcpFilters, GcpQuery, getQuery } from 'api/queries/gcpQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const gcpOcpDashboardStateKey = 'gcpOcpDashboard';
export const gcpOcpDashboardDefaultFilters: GcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const gcpOcpDashboardTabFilters: GcpFilters = {
  ...gcpOcpDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum GcpOcpDashboardTab {
  services = 'services',
  accounts = 'accounts',
  projects = 'projects',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface GcpOcpDashboardWidget extends DashboardWidget<GcpOcpDashboardTab> {}

export function getGroupByForTab(widget: GcpOcpDashboardWidget): GcpQuery['group_by'] {
  switch (widget.currentTab) {
    case GcpOcpDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case GcpOcpDashboardTab.accounts:
      return { account: '*' };
    case GcpOcpDashboardTab.projects:
      return { project: '*' };
    case GcpOcpDashboardTab.regions:
      return { region: '*' };
    case GcpOcpDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: GcpFilters = gcpOcpDashboardDefaultFilters, props?) {
  const query: GcpQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: GcpOcpDashboardWidget,
  filter: GcpFilters = gcpOcpDashboardDefaultFilters
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === GcpOcpDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: GcpQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
