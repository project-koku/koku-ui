import type { OcpCloudFilters, OcpCloudQuery } from '@koku-ui/api/queries/ocpCloudQuery';
import { getQuery } from '@koku-ui/api/queries/ocpCloudQuery';

import type { DashboardWidget } from '../common/dashboardCommon';

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
  accounts = 'accounts',
  regions = 'regions',
  services = 'services',
}

// Todo: cluster, project, node
export function getGroupByForTab(widget: DashboardWidget): OcpCloudQuery['group_by'] {
  switch (widget.currentTab) {
    case OcpCloudDashboardTab.accounts:
      return { account: '*' };
    case OcpCloudDashboardTab.regions:
      return { region: '*' };
    case OcpCloudDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters, props?) {
  const query: OcpCloudQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: DashboardWidget,
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters,
  props?
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === OcpCloudDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: OcpCloudQuery = {
    filter: newFilter,
    group_by,
    ...(props ? props : {}),
  };
  return getQuery(query);
}
