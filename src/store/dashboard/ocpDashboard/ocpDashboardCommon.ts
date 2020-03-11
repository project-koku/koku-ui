import { getQuery, OcpFilters, OcpQuery } from 'api/ocpQuery';
import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/charts/common/chartUtils';

export const ocpDashboardStateKey = 'ocpDashboard';
export const ocpDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpDashboardTabFilters: OcpFilters = {
  ...ocpDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: OcpReportType;
  availableTabs?: OcpDashboardTab[];
  currentTab: OcpDashboardTab;
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
export function getGroupByForTab(tab: OcpDashboardTab): OcpQuery['group_by'] {
  switch (tab) {
    case OcpDashboardTab.projects:
      return { project: '*' };
    case OcpDashboardTab.clusters:
      return { cluster: '*' };
    case OcpDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpFilters = ocpDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpDashboardWidget,
  filter: OcpFilters = ocpDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
