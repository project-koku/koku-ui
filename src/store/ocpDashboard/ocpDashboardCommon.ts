import { getQuery, OcpFilters, OcpQuery } from 'api/ocpQuery';
import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/commonChart/chartUtils';

export const ocpDashboardStateKey = 'ocpDashboard';
export const ocpDashboardDefaultFilters: OcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
  limit: 5,
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
  availableTabs: OcpDashboardTab[];
  currentTab: OcpDashboardTab;
  details: {
    /** i18n label key */
    labelKey?: string;
    /** i18n label key context used to support multiple units. */
    labelKeyContext?: string;
    formatOptions: ValueFormatOptions;
    requestLabelKey?: string;
  };
  trend: {
    titleKey?: string;
    type: ChartType;
    formatOptions: ValueFormatOptions;
    requestLegendKey?: string;
    usageLegendKey?: string;
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
  widget: OcpDashboardWidget,
  filter: OcpFilters = ocpDashboardDefaultFilters
) {
  const query: OcpQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
