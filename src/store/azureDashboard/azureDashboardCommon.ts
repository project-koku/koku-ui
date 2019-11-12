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
  service_names = 'service_names',
  subscription_guids = 'subscription_guids',
  resource_locations = 'resource_locations',
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
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string /** i18n label key */;
  };
  filter?: {
    limit?: number;
    service_name?: string;
  };
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  tabsFilter?: {
    limit?: number;
    service_name?: string;
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
    case AzureDashboardTab.service_names:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service_name:
          widget.tabsFilter && widget.tabsFilter.service_name
            ? widget.tabsFilter.service_name
            : '*',
      };
    case AzureDashboardTab.subscription_guids:
      return { subscription_guid: '*' };
    case AzureDashboardTab.resource_locations:
      return { resource_location: '*' };
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
    widget.currentTab === AzureDashboardTab.service_names &&
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
