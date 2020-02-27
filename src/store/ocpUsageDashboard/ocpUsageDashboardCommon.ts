import { getQuery, OcpFilters, OcpQuery } from 'api/ocpQuery';
import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const ocpUsageDashboardStateKey = 'ocpUsageDashboard';
export const ocpUsageDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpUsageDashboardTabFilters: OcpFilters = {
  ...ocpUsageDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpUsageDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpUsageDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: OcpReportType;
  availableTabs: OcpUsageDashboardTab[];
  currentTab: OcpUsageDashboardTab;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    requestFormatOptions?: ValueFormatOptions;
    requestKey?: string /** i18n label key */;
    showUnits?: boolean;
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string /** i18n label key */;
  };
  filter?: {
    limit?: number;
    service?: string;
  };
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  isUsageFirst?: boolean;
  tabsFilter?: {
    limit?: number;
    service?: string;
  };
  trend: {
    formatOptions: ValueFormatOptions;
    titleKey?: string;
    type: ChartType;
  };
  topItems: {
    formatOptions: {};
  };
}

// Todo: cluster, project, node
export function getGroupByForTab(
  tab: OcpUsageDashboardTab
): OcpQuery['group_by'] {
  switch (tab) {
    case OcpUsageDashboardTab.projects:
      return { project: '*' };
    case OcpUsageDashboardTab.clusters:
      return { cluster: '*' };
    case OcpUsageDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpFilters = ocpUsageDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpUsageDashboardWidget,
  filter: OcpFilters = ocpUsageDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
