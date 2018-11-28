import { AwsFilters, AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/commonChart/chartUtils';

export const awsDashboardStateKey = 'awsDashboard';
export const awsDashboardDefaultFilters: AwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
  limit: 5,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum AwsDashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface AwsDashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: AwsReportType;
  availableTabs: AwsDashboardTab[];
  currentTab: AwsDashboardTab;
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

export function getGroupByForTab(tab: AwsDashboardTab): AwsQuery['group_by'] {
  switch (tab) {
    case AwsDashboardTab.services:
      return { service: '*' };
    case AwsDashboardTab.accounts:
      return { account: '*' };
    case AwsDashboardTab.regions:
      return { region: '*' };
    case AwsDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  widget: AwsDashboardWidget,
  filter: AwsFilters = awsDashboardDefaultFilters
) {
  const query: AwsQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
