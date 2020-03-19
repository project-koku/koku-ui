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
    costKey?: string /** i18n key */;
    formatOptions: ValueFormatOptions;
    labelKey?: string /** i18n key */;
    requestFormatOptions?: {
      fractionDigits?: number;
    };
    requestKey?: string;
    showTooltip?: boolean;
    showUnits?: boolean;
    showUsageLegendLabel?: boolean;
    units?: string;
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string /** i18n key */;
  };
  filter?: {
    limit?: number;
    service?: string;
    service_name?: string;
  };
  id: number;
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  isUsageFirst?: boolean;
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
