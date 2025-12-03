import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';
import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import type { FormatOptions, Formatter } from '../../../utils/format';

export const enum DashboardChartType {
  cost = 'cost', // // This displays cumulative cost compared to infrastructure cost
  dailyCost = 'dailyCost', // This displays cumulative and daily cost compared to infrastructure cost
  dailyTrend = 'dailyTrend', // This displays cumulative and daily cost
  trend = 'trend', // This displays cumulative cost only
  usage = 'usage', // This displays daily usage and requests
}

export interface DashboardWidget {
  availableTabs?: string[];
  chartFormatter?: Formatter;
  chartName?: string; // Will be the prefix for ids within the chart
  chartType?: DashboardChartType;
  currentTab?: any;
  details?: {
    costKey?: MessageDescriptor; // i18n key
    formatOptions?: FormatOptions;
    requestFormatOptions?: FormatOptions;
    requestKey?: MessageDescriptor;
    showHorizontal?: boolean; // Show horizontal layout
    showOptimizations?: boolean; // Show optimizations
    showTooltip?: boolean; // Show cost tooltip
    showUnits?: boolean; // Show units
    showUsageFirst?: boolean; // Show usage before cost
    showUsageLegendLabel?: boolean;
    usageKey?: MessageDescriptor; // i18n key
    viewAllPath?: string; // View all link to details page
    units?: string; // Override units shown as workaround for missing Azure API units
    usageFormatOptions?: FormatOptions;
  };
  filter?: {
    database_services?: string;
    limit?: number;
    network_services?: string;
    product_service?: string;
    service?: string;
    service_name?: string;
  };
  forecastPathsType?: ForecastPathsType;
  forecastType?: ForecastType;
  id?: number;
  reportPathsType?: ReportPathsType; // Cost report
  reportType?: ReportType; // Cost report
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey?: MessageDescriptor;
  tabsFilter?: {
    database_services?: string;
    limit?: number;
    network_services?: string;
    product_service?: string;
    service?: string;
    service_name?: string;
  };
  trend?: {
    computedForecastItem?: string; // The computed forecast item to use in charts.
    computedForecastInfrastructureItem?: string; // The computed forecast infrastructure item to use in charts.
    computedReportItem?: string; // The computed report item to use in charts, summary, etc.
    computedReportItemValue?: string; // The computed report value (e.g., raw, markup, total, or usage)
    costDistribution?: string; // The computed report value for tabs grouped by project
    dailyTitleKey?: MessageDescriptor;
    datumType: number;
    formatOptions?: FormatOptions;
    showSupplementaryLabel?: boolean; // Trend chart legend items show "Supplementary cost" instead of "cost"
    titleKey?: MessageDescriptor;
  };
  topItems?: {
    formatOptions?: FormatOptions;
  };
}
