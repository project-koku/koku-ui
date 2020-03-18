import { ReportType } from 'api/reports/report';

export const enum DashboardChartType {
  cost = 'cost',
  trend = 'trend',
  usage = 'usage',
}

export const enum DashboardPerspective {
  aws = 'aws',
  awsCloud = 'aws_cloud', // Aws filtered by Ocp
  azure = 'azure',
  azureCloud = 'azure_cloud', // Azure filtered by Ocp
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud', // All filtered by Ocp
  ocpUsage = 'ocp_usage',
  ocpSupplementary = 'ocp_supplementary',
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
  perspective?: DashboardPerspective;
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
