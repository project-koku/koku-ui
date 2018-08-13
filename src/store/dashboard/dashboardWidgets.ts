import { ReportType } from 'api/reports';
import { TrendChartType } from 'components/trendChart/trendChartUtils';
import { DashboardTab, DashboardWidget } from './dashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
  id: getId(),
  titleKey: 'dashboard_page.cost_title',
  reportType: ReportType.cost,
  details: {
    labelKey: 'dashboard_page.cost_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'dashboard_page.cost_trend_title',
    formatOptions: {},
    type: TrendChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    DashboardTab.services,
    DashboardTab.accounts,
    DashboardTab.regions,
  ],
  currentTab: DashboardTab.services,
};

export const storageWidget: DashboardWidget = {
  id: getId(),
  titleKey: 'dashboard_page.storage_title',
  reportType: ReportType.storage,
  details: {
    labelKey: 'dashboard_page.storage_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'dashboard_page.storage_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: TrendChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [DashboardTab.accounts, DashboardTab.regions],
  currentTab: DashboardTab.accounts,
};

export const computeWidget: DashboardWidget = {
  id: getId(),
  titleKey: 'dashboard_page.compute_title',
  reportType: ReportType.instanceType,
  details: {
    labelKey: 'dashboard_page.compute_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'Month to Month Daily Average Instance Hours',
    formatOptions: {
      fractionDigits: 2,
    },
    type: TrendChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    DashboardTab.instanceType,
    DashboardTab.accounts,
    DashboardTab.regions,
  ],
  currentTab: DashboardTab.instanceType,
};
