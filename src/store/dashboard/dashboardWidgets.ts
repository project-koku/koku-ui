import { ReportType } from 'api/reports';
import { ChartType } from 'components/commonChart/chartUtils';
import { DashboardTab, DashboardWidget } from './dashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
  id: getId(),
  titleKey: 'total_cost',
  reportType: ReportType.cost,
  details: {
    labelKey: 'total_cost',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'dashboard_page.cloud.cost_trend_title',
    formatOptions: {},
    type: ChartType.rolling,
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
  titleKey: 'dashboard_page.cloud.storage_title',
  reportType: ReportType.storage,
  details: {
    labelKey: 'dashboard_page.cloud.storage_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'dashboard_page.cloud.storage_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [DashboardTab.accounts, DashboardTab.regions],
  currentTab: DashboardTab.accounts,
};

export const computeWidget: DashboardWidget = {
  id: getId(),
  titleKey: 'dashboard_page.cloud.compute_title',
  reportType: ReportType.instanceType,
  details: {
    labelKey: 'dashboard_page.cloud.compute_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'dashboard_page.cloud.compute_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
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
