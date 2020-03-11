import { getQuery, OcpFilters, OcpQuery } from 'api/ocpQuery';
import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/charts/common/chartUtils';

export const ocpSupplementaryDashboardStateKey = 'ocpSupplementaryDashboard';
export const ocpSupplementaryDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpSupplementaryDashboardTabFilters: OcpFilters = {
  ...ocpSupplementaryDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpSupplementaryDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpSupplementaryDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: OcpReportType;
  availableTabs?: OcpSupplementaryDashboardTab[];
  currentTab: OcpSupplementaryDashboardTab;
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
  tab: OcpSupplementaryDashboardTab
): OcpQuery['group_by'] {
  switch (tab) {
    case OcpSupplementaryDashboardTab.projects:
      return { project: '*' };
    case OcpSupplementaryDashboardTab.clusters:
      return { cluster: '*' };
    case OcpSupplementaryDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpFilters = ocpSupplementaryDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpSupplementaryDashboardWidget,
  filter: OcpFilters = ocpSupplementaryDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
