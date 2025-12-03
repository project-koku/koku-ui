import type { GcpFilters, GcpQuery } from '@koku-ui/api/queries/gcpQuery';
import { getQuery } from '@koku-ui/api/queries/gcpQuery';

import type { DashboardWidget } from '../common/dashboardCommon';

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

export const enum GcpOcpDashboardTab {
  accounts = 'accounts',
  gcpProjects = 'gcp_projects',
  regions = 'regions',
  services = 'services',
}

export function getGroupByForTab(widget: DashboardWidget): GcpQuery['group_by'] {
  switch (widget.currentTab) {
    case GcpOcpDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case GcpOcpDashboardTab.accounts:
      return { account: '*' };
    case GcpOcpDashboardTab.gcpProjects:
      return { gcp_project: '*' };
    case GcpOcpDashboardTab.regions:
      return { region: '*' };
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
  widget: DashboardWidget,
  filter: GcpFilters = gcpOcpDashboardDefaultFilters,
  props?
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
    ...(props ? props : {}),
  };
  return getQuery(query);
}
