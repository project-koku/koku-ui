import { AzureFilters, AzureQuery, getQuery } from 'api/queries/azureQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

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

// eslint-disable-next-line no-shadow
export const enum AzureOcpDashboardTab {
  service_names = 'service_names',
  subscription_guids = 'subscription_guids',
  resource_locations = 'resource_locations',
  instanceType = 'instance_type',
}

export interface AzureOcpDashboardWidget extends DashboardWidget<AzureOcpDashboardTab> {}

export function getGroupByForTab(widget: AzureOcpDashboardWidget): AzureQuery['group_by'] {
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
    case AzureOcpDashboardTab.instanceType:
      return { instance_type: '*' };
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
  widget: AzureOcpDashboardWidget,
  filter: AzureFilters = azureOcpDashboardDefaultFilters
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
  };
  return getQuery(query);
}
