import {
  getQuery,
  OcpOnCloudFilters,
  OcpOnCloudQuery,
} from 'api/ocpOnCloudQuery';
import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const ocpOnCloudDashboardStateKey = 'ocpOnCloudDashboard';
export const ocpOnCloudDashboardDefaultFilters: OcpOnCloudFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpOnCloudDashboardTabFilters: OcpOnCloudFilters = {
  ...ocpOnCloudDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpOnCloudDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpOnCloudDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: OcpOnCloudReportType;
  availableTabs?: OcpOnCloudDashboardTab[];
  currentTab?: OcpOnCloudDashboardTab;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    requestKey?: string /** i18n label key */;
    showUnits?: boolean;
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string /** i18n label key */;
  };
  filter?: {
    limit?: number;
    service?: string;
    service_name?: string;
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
  tab: OcpOnCloudDashboardTab
): OcpOnCloudQuery['group_by'] {
  switch (tab) {
    case OcpOnCloudDashboardTab.projects:
      return { project: '*' };
    case OcpOnCloudDashboardTab.clusters:
      return { cluster: '*' };
    case OcpOnCloudDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpOnCloudFilters = ocpOnCloudDashboardDefaultFilters
) {
  const query: OcpOnCloudQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpOnCloudDashboardWidget,
  filter: OcpOnCloudFilters = ocpOnCloudDashboardDefaultFilters
) {
  const query: OcpOnCloudQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
