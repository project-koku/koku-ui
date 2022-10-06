import { getQuery, IbmFilters, IbmQuery } from 'api/queries/ibmQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ibmDashboardStateKey = 'ibmDashboard';
export const ibmDashboardDefaultFilters: IbmFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ibmDashboardTabFilters: IbmFilters = {
  ...ibmDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum IbmDashboardTab {
  services = 'services',
  accounts = 'accounts',
  projects = 'projects',
  regions = 'regions',
}

export interface IbmDashboardWidget extends DashboardWidget<IbmDashboardTab> {}

export function getGroupByForTab(widget: IbmDashboardWidget): IbmQuery['group_by'] {
  switch (widget.currentTab) {
    case IbmDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case IbmDashboardTab.accounts:
      return { account: '*' };
    case IbmDashboardTab.projects:
      return { project: '*' };
    case IbmDashboardTab.regions:
      return { region: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: IbmFilters = ibmDashboardDefaultFilters, props?) {
  const query: IbmQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: IbmDashboardWidget,
  filter: IbmFilters = ibmDashboardDefaultFilters,
  props?
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === IbmDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: IbmQuery = {
    filter: newFilter,
    group_by,
    ...(props ? props : {}),
  };
  return getQuery(query);
}
