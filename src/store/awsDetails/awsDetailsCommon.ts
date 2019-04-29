import { AwsFilters, AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const awsDetailsStateKey = 'awsDetails';
export const awsDetailsDefaultFilters: AwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const awsDetailsTabFilters: AwsFilters = {
  ...awsDetailsDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum AwsDetailsTab {
  accounts = 'accounts',
  regions = 'regions',
  services = 'services',
}

export interface AwsDetailsWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey?: string;
  reportType: AwsReportType;
  availableTabs?: AwsDetailsTab[];
  currentTab?: AwsDetailsTab;
  details?: {
    /** i18n label key */
    labelKey?: string;
    /** i18n label key context used to support multiple units. */
    labelKeyContext?: string;
    formatOptions?: ValueFormatOptions;
    requestKey?: string;
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
  trend?: {
    currentRequestLabelKey?: string;
    currentTitleKey?: string;
    currentUsageLabelKey?: string;
    formatOptions: ValueFormatOptions;
    previousRequestLabelKey?: string;
    previousTitleKey?: string;
    previousUsageLabel?: string;
    titleKey?: string;
    type: ChartType;
  };
  topItems?: {
    formatOptions: {};
  };
}

export function getGroupByForTab(tab: AwsDetailsTab): AwsQuery['group_by'] {
  switch (tab) {
    case AwsDetailsTab.accounts:
      return { account: '*' };
    case AwsDetailsTab.regions:
      return { region: '*' };
    case AwsDetailsTab.services:
      return { service: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  widget: AwsDetailsWidget,
  filter: AwsFilters = awsDetailsDefaultFilters
) {
  const query: AwsQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
