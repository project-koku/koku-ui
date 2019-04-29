import { getQuery, OcpOnAwsFilters, OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const ocpOnAwsDashboardStateKey = 'ocpOnAwsDashboard';
export const ocpOnAwsDashboardDefaultFilters: OcpOnAwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpOnAwsDashboardTabFilters: OcpOnAwsFilters = {
  ...ocpOnAwsDashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpOnAwsDashboardTab {
  nodes = 'nodes',
  clusters = 'clusters',
  projects = 'projects',
}

export interface OcpOnAwsDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: OcpOnAwsReportType;
  availableTabs?: OcpOnAwsDashboardTab[];
  currentTab?: OcpOnAwsDashboardTab;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    requestKey?: string /** i18n label key */;
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
  tab: OcpOnAwsDashboardTab
): OcpOnAwsQuery['group_by'] {
  switch (tab) {
    case OcpOnAwsDashboardTab.projects:
      return { project: '*' };
    case OcpOnAwsDashboardTab.clusters:
      return { cluster: '*' };
    case OcpOnAwsDashboardTab.nodes:
      return { node: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpOnAwsFilters = ocpOnAwsDashboardDefaultFilters
) {
  const query: OcpOnAwsQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpOnAwsDashboardWidget,
  filter: OcpOnAwsFilters = ocpOnAwsDashboardDefaultFilters
) {
  const query: OcpOnAwsQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };
  return getQuery(query);
}
