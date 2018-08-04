import { getQuery, Query } from 'api/query';
import { ReportType } from 'api/reports';

export const dashboardStateKey = 'dashboard';

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum DashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
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
    /** i18n single date description passed { startDate, endDate, month, time } */
    descriptionKeySingle: string;
    formatOptions: ValueFormatOptions;
    /** i18n range description for the title. passed { startDate, endDate, month, time } */
    descriptionKeyRange?: string;
  };
  trend: {
    titleKey: string;
    formatOptions: ValueFormatOptions;
  };
}

export function getGroupByForTab(tab: DashboardTab): Query['group_by'] {
  switch (tab) {
    case DashboardTab.services:
      return { service: '*' };
    case DashboardTab.accounts:
      return { account: '*' };
    case DashboardTab.regions:
      return {};
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
    },
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
