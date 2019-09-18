import { AzureFilters, AzureQuery, getQuery } from 'api/azureQuery';
import { AzureReportType } from 'api/azureReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const azureDashboardStateKey = 'azureDashboard';
export const azureDashboardDefaultFilters: AzureFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const azureDashboardTabFilters: AzureFilters = {
  ...azureDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum AzureDashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface AzureDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: AzureReportType;
  availableTabs: AzureDashboardTab[];
  currentTab: AzureDashboardTab;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    showUnits?: boolean;
    usageKey?: string /** i18n label key */;
  };
  filter?: {
    limit?: number;
    service?: string;
  };
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  tabsFilter?: {
    limit?: number;
    service?: string;
  };
  trend: {
    titleKey: string;
    type: ChartType;
    formatOptions: ValueFormatOptions;
  };
  topItems: {
    formatOptions: {};
  };
}

export function getGroupByForTab(
  widget: AzureDashboardWidget
): AzureQuery['group_by'] {
  switch (widget.currentTab) {
    case AzureDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service:
          widget.tabsFilter && widget.tabsFilter.service
            ? widget.tabsFilter.service
            : '*',
      };
    case AzureDashboardTab.accounts:
      return { account: '*' };
    case AzureDashboardTab.regions:
      return { region: '*' };
    case AzureDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: AzureFilters = azureDashboardDefaultFilters
) {
  const query: AzureQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: AzureDashboardWidget,
  filter: AzureFilters = azureDashboardDefaultFilters
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (
    widget.currentTab === AzureDashboardTab.services &&
    widget.tabsFilter &&
    widget.tabsFilter.service
  ) {
    newFilter.service = undefined;
  }
  const query: AzureQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
