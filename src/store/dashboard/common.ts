export interface ValueFormatOptions {
  fractionDigits?: number;
}

export interface DashboardWidget {
  availableTabs?: any[];
  currentTab: any;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    showUnits?: boolean;
    showUsageLegendLabel?: boolean;
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string /** i18n label key */;
  };
  filter?: {
    limit?: number;
    service?: string;
  };
  id: number;
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  isUsageFirst?: boolean;
  reportType: any;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  tabsFilter?: {
    limit?: number;
    service?: string;
  };
  trend: {
    titleKey: string;
    type: number;
    formatOptions: ValueFormatOptions;
  };
  topItems: {
    formatOptions: {};
  };
}
