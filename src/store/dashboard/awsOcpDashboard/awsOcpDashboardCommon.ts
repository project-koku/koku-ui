import type { AwsFilters, AwsQuery } from 'api/queries/awsQuery';
import { getQuery } from 'api/queries/awsQuery';
import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const awsOcpDashboardStateKey = 'awsOcpDashboard';
export const awsOcpDashboardDefaultFilters: AwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const awsOcpDashboardTabFilters: AwsFilters = {
  ...awsOcpDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum AwsOcpDashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
}

export interface AwsOcpDashboardWidget extends DashboardWidget<AwsOcpDashboardTab> {
  // TBD...
}

export function getGroupByForTab(widget: AwsOcpDashboardWidget): AwsQuery['group_by'] {
  switch (widget.currentTab) {
    case AwsOcpDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case AwsOcpDashboardTab.accounts:
      return { account: '*' };
    case AwsOcpDashboardTab.regions:
      return { region: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  widget: AwsOcpDashboardWidget,
  filter: AwsFilters = awsOcpDashboardDefaultFilters,
  props?
) {
  const query: AwsQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: AwsOcpDashboardWidget,
  filter: AwsFilters = awsOcpDashboardDefaultFilters,
  props?
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === AwsOcpDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: AwsQuery = {
    filter: newFilter,
    group_by,
    ...(props ? props : {}),
  };
  return getQuery(query);
}
