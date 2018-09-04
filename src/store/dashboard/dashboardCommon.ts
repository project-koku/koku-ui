import { getQuery, Query } from 'api/query';
import { ReportType } from 'api/reports';
import { ChartType } from 'components/commonChart/chartUtils';

export const dashboardStateKey = 'dashboard';

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum DashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface DashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: ReportType;
  availableTabs: DashboardTab[];
  currentTab: DashboardTab;
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

export function getGroupByForTab(tab: DashboardTab): Query['group_by'] {
  switch (tab) {
    case DashboardTab.services:
      return { service: '*' };
    case DashboardTab.accounts:
      return { account: '*' };
    case DashboardTab.regions:
      return { region: '*' };
    case DashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(widget: DashboardWidget, timeScope: number) {
  const query: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: timeScope,
      resolution: 'daily',
      limit: 5,
    },
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
