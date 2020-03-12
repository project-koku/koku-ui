import { AwsFilters, AwsQuery, getQuery } from 'api/queries/awsQuery';
import { AwsReportType } from 'api/reports/awsReports';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const awsCloudDashboardStateKey = 'awsCloudDashboard';
export const awsCloudDashboardDefaultFilters: AwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const awsCloudDashboardTabFilters: AwsFilters = {
  ...awsCloudDashboardDefaultFilters,
  limit: 3,
};

export const enum AwsCloudDashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface AwsCloudDashboardWidget extends DashboardWidget {
  availableTabs?: AwsCloudDashboardTab[];
  reportType: AwsReportType;
  currentTab: AwsCloudDashboardTab;
}

export function getGroupByForTab(
  widget: AwsCloudDashboardWidget
): AwsQuery['group_by'] {
  switch (widget.currentTab) {
    case AwsCloudDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service:
          widget.tabsFilter && widget.tabsFilter.service
            ? widget.tabsFilter.service
            : '*',
      };
    case AwsCloudDashboardTab.accounts:
      return { account: '*' };
    case AwsCloudDashboardTab.regions:
      return { region: '*' };
    case AwsCloudDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: AwsFilters = awsCloudDashboardDefaultFilters
) {
  const query: AwsQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: AwsCloudDashboardWidget,
  filter: AwsFilters = awsCloudDashboardDefaultFilters
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (
    widget.currentTab === AwsCloudDashboardTab.services &&
    widget.tabsFilter &&
    widget.tabsFilter.service
  ) {
    newFilter.service = undefined;
  }
  const query: AwsQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
