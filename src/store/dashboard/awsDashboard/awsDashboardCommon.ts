import { AwsFilters, AwsQuery, getQuery } from 'api/queries/awsQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const awsDashboardStateKey = 'awsDashboard';
export const awsDashboardDefaultFilters: AwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const awsDashboardTabFilters: AwsFilters = {
  ...awsDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum AwsDashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface AwsDashboardWidget extends DashboardWidget<AwsDashboardTab> {}

export function getGroupByForTab(widget: AwsDashboardWidget): AwsQuery['group_by'] {
  switch (widget.currentTab) {
    case AwsDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case AwsDashboardTab.accounts:
      return { account: '*' };
    case AwsDashboardTab.regions:
      return { region: '*' };
    case AwsDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: AwsFilters = awsDashboardDefaultFilters) {
  const query: AwsQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(widget: AwsDashboardWidget, filter: AwsFilters = awsDashboardDefaultFilters) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === AwsDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: AwsQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
