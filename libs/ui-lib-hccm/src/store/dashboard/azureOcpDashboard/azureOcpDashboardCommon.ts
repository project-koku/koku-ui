import type { AzureFilters, AzureQuery } from '@koku-ui/api/queries/azureQuery';
import { getQuery } from '@koku-ui/api/queries/azureQuery';

import type { DashboardWidget } from '../common/dashboardCommon';

export const azureOcpDashboardStateKey = 'azureOcpDashboard';
export const azureOcpDashboardDefaultFilters: AzureFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const azureOcpDashboardTabFilters: AzureFilters = {
  ...azureOcpDashboardDefaultFilters,
  limit: 3,
};

export const enum AzureOcpDashboardTab {
  service_names = 'service_names',
  subscription_guids = 'subscription_guids',
  resource_locations = 'resource_locations',
}

export function getGroupByForTab(widget: DashboardWidget): AzureQuery['group_by'] {
  switch (widget.currentTab) {
    case AzureOcpDashboardTab.service_names:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service_name: widget.tabsFilter && widget.tabsFilter.service_name ? widget.tabsFilter.service_name : '*',
      };
    case AzureOcpDashboardTab.subscription_guids:
      return { subscription_guid: '*' };
    case AzureOcpDashboardTab.resource_locations:
      return { resource_location: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: AzureFilters = azureOcpDashboardDefaultFilters, props?) {
  const query: AzureQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: DashboardWidget,
  filter: AzureFilters = azureOcpDashboardDefaultFilters,
  props?
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === AzureOcpDashboardTab.service_names && widget.tabsFilter && widget.tabsFilter.service_name) {
    newFilter.service = undefined;
  }
  const query: AzureQuery = {
    filter: newFilter,
    group_by,
    ...(props ? props : {}),
  };
  return getQuery(query);
}
