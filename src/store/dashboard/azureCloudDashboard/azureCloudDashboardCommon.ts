import { AzureFilters, AzureQuery, getQuery } from 'api/queries/azureQuery';
import { ReportType } from 'api/reports/report';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const azureCloudDashboardStateKey = 'azureCloudDashboard';
export const azureCloudDashboardDefaultFilters: AzureFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const azureCloudDashboardTabFilters: AzureFilters = {
  ...azureCloudDashboardDefaultFilters,
  limit: 3,
};

export const enum AzureCloudDashboardTab {
  service_names = 'service_names',
  subscription_guids = 'subscription_guids',
  resource_locations = 'resource_locations',
  instanceType = 'instance_type',
}

export interface AzureCloudDashboardWidget
  extends DashboardWidget<ReportType, AzureCloudDashboardTab> {}

export function getGroupByForTab(
  widget: AzureCloudDashboardWidget
): AzureQuery['group_by'] {
  switch (widget.currentTab) {
    case AzureCloudDashboardTab.service_names:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service_name:
          widget.tabsFilter && widget.tabsFilter.service_name
            ? widget.tabsFilter.service_name
            : '*',
      };
    case AzureCloudDashboardTab.subscription_guids:
      return { subscription_guid: '*' };
    case AzureCloudDashboardTab.resource_locations:
      return { resource_location: '*' };
    case AzureCloudDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: AzureFilters = azureCloudDashboardDefaultFilters
) {
  const query: AzureQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: AzureCloudDashboardWidget,
  filter: AzureFilters = azureCloudDashboardDefaultFilters
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (
    widget.currentTab === AzureCloudDashboardTab.service_names &&
    widget.tabsFilter &&
    widget.tabsFilter.service_name
  ) {
    newFilter.service = undefined;
  }
  const query: AzureQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
