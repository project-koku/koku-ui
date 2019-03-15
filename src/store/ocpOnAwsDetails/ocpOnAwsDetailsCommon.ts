import { getQuery, OcpOnAwsFilters, OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const ocpOnAwsDetailsStateKey = 'ocpOnAwsDetails';
export const ocpOnAwsDetailsDefaultFilters: OcpOnAwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpOnAwsDetailsTabFilters: OcpOnAwsFilters = {
  ...ocpOnAwsDetailsDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum OcpOnAwsDetailsTab {
  accounts = 'accounts',
  projects = 'projects',
  regions = 'regions',
  services = 'services',
}

export interface OcpOnAwsDetailsWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey?: string;
  reportType: OcpOnAwsReportType;
  availableTabs?: OcpOnAwsDetailsTab[];
  currentTab?: OcpOnAwsDetailsTab;
  details?: {
    /** i18n label key */
    labelKey?: string;
    /** i18n label key context used to support multiple units. */
    labelKeyContext?: string;
    formatOptions?: ValueFormatOptions;
    requestLabelKey?: string;
  };
  filter?: {
    limit?: number;
    product_family?: string;
  };
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  tabsFilter?: {
    limit?: number;
    product_family?: string;
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

export function getGroupByForTab(
  tab: OcpOnAwsDetailsTab
): OcpOnAwsQuery['group_by'] {
  switch (tab) {
    case OcpOnAwsDetailsTab.accounts:
      return { account: '*' };
    case OcpOnAwsDetailsTab.projects:
      return { project: '*' };
    case OcpOnAwsDetailsTab.regions:
      return { region: '*' };
    case OcpOnAwsDetailsTab.services:
      return { service: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  widget: OcpOnAwsDetailsWidget,
  filter: OcpOnAwsFilters = ocpOnAwsDetailsDefaultFilters
) {
  const query: OcpOnAwsQuery = {
    filter,
    group_by: getGroupByForTab(widget.currentTab),
  };

  return getQuery(query);
}
