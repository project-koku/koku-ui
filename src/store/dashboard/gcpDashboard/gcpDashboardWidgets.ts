import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { GcpDashboardTab, GcpDashboardWidget } from './gcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.compute_title',
  forecastPathsType: ForecastPathsType.gcp,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },
  filter: {
    service: 'Compute Engine',
  },
  tabsFilter: {
    service: 'Compute Engine',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.instanceType,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.instanceType,
};

export const costSummaryWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.gcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: paths.gcpDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: 'gcp_dashboard.daily_cost_trend_title',
    titleKey: 'gcp_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [GcpDashboardTab.services, GcpDashboardTab.projects, GcpDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: GcpDashboardTab.services,
};

export const databaseWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.database_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.database,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service: 'Bigtable,Datastore,Database Migrations,Firestore,MemoryStore,Spanner,SQL',
  },
  tabsFilter: {
    service: 'Bigtable,Datastore,Database Migrations,Firestore,MemoryStore,Spanner,SQL',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const networkWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.network_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.network,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'VPC network,Network services,Hybrid Connectivity,Network Service Tiers,Network Security,Network Intelligence',
  },
  tabsFilter: {
    service:
      'VPC network,Network services,Hybrid Connectivity,Network Service Tiers,Network Security,Network Intelligence',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const storageWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.storage_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.storage,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.projects,
};
