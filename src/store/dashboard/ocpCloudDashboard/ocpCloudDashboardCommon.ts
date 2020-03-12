import {
  getQuery,
  OcpCloudFilters,
  OcpCloudQuery,
} from 'api/queries/ocpCloudQuery';
import { OcpCloudReportType } from 'api/reports/ocpCloudReports';
import { ChartType } from 'components/charts/common/chartUtils';

export const ocpCloudDashboardStateKey = 'ocpCloudDashboard';
export const ocpCloudDashboardDefaultFilters: OcpCloudFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpCloudDashboardTabFilters: OcpCloudFilters = {
  ...ocpCloudDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpCloudDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpCloudDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: OcpCloudReportType;
  availableTabs?: OcpCloudDashboardTab[];
  currentTab?: OcpCloudDashboardTab;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    requestFormatOptions?: ValueFormatOptions;
    requestKey?: string /** i18n label key */;
    showUnits?: boolean;
    showUsageLegendLabel?: boolean;
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
  topItems?: {
    formatOptions: {};
  };
}

// Todo: cluster, project, node
export function getGroupByForTab(
  tab: OcpCloudDashboardTab
): OcpCloudQuery['group_by'] {
  switch (tab) {
    case OcpCloudDashboardTab.projects:
      return { project: '*' };
    case OcpCloudDashboardTab.clusters:
      return { cluster: '*' };
    case OcpCloudDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters
) {
  const query: OcpCloudQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpCloudDashboardWidget,
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters
) {
  const query: OcpCloudQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
