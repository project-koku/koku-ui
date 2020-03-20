import { ReportPathsType, ReportType } from 'api/reports/report';

export const enum DashboardChartType {
  cost = 'cost',
  trend = 'trend',
  usage = 'usage',
}

export interface ValueFormatOptions {
  fractionDigits?: number;
}

export interface DashboardWidget<T> {
  availableTabs?: T[];
  chartType?: DashboardChartType;
  currentTab?: T;
  details: {
    appNavPath?: string; // Highlights Insights nav-item when view all link is clicked
    costKey?: string; // i18n key
    formatOptions: ValueFormatOptions;
    labelKey?: string; // i18n key
    requestFormatOptions?: {
      fractionDigits?: number;
    };
    requestKey?: string;
    showHorizontal?: boolean; // Show horizontal layout
    showTooltip?: boolean; // Show cost tooltip
    showUnits?: boolean; // Show units
    showUsageFirst?: boolean; // Show usage before cost
    showUsageLegendLabel?: boolean;
    units?: string; // Override units shown as workaround for missing Azure API units
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string; // i18n key
    viewAllPath?: string; // View all link to details page
  };
  filter?: {
    limit?: number;
    service?: string;
    service_name?: string;
  };
  id: number;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  tabsFilter?: {
    limit?: number;
    service?: string;
    service_name?: string;
  };
  trend: {
    comparison: string;
    titleKey: string;
    type: number;
    formatOptions: ValueFormatOptions;
  };
  topItems?: {
    formatOptions: {};
  };
}
