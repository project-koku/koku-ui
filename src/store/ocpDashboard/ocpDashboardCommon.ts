import { Filters, getQuery, Query } from 'api/query';
import { ReportType } from 'api/reports';
import { ChartType } from 'components/commonChart/chartUtils';

export const ocpDashboardStateKey = 'ocpDashboard';
export const ocpDashboardDefaultFilters: Filters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
  limit: 5,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpDashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface OcpDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: ReportType;
  availableTabs: OcpDashboardTab[];
  currentTab: OcpDashboardTab;
  details: {
    /** i18n label key */
    labelKey: string;
    /** i18n label key context used to support multiple units. */
    labelKeyContext?: string;
    formatOptions: ValueFormatOptions;
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

export function getGroupByForTab(tab: OcpDashboardTab): Query['group_by'] {
  switch (tab) {
    case OcpDashboardTab.services:
      return { service: '*' };
    case OcpDashboardTab.accounts:
      return { account: '*' };
    case OcpDashboardTab.regions:
      return { region: '*' };
    case OcpDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  widget: OcpDashboardWidget,
  filter: Filters = ocpDashboardDefaultFilters
) {
  const query: Query = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
