import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { GcpOcpDashboardTab, GcpOcpDashboardWidget } from './gcpOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: GcpOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.GCPComputeTitle,
  forecastPathsType: ForecastPathsType.gcpOcp,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: messages.Usage,
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
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpOcpDashboardTab.instanceType,
  //   GcpOcpDashboardTab.accounts,
  //   GcpOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpOcpDashboardTab.instanceType,
};

export const costSummaryWidget: GcpOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.GCPCostTitle,
  forecastPathsType: ForecastPathsType.gcpOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: messages.GCPDailyCostTrendTitle,
    titleKey: messages.GCPCostTrendTitle,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [GcpOcpDashboardTab.services, GcpOcpDashboardTab.projects, GcpOcpDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: GcpOcpDashboardTab.services,
};

export const databaseWidget: GcpOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpOcpDashboardTab.services,
  //   GcpOcpDashboardTab.accounts,
  //   GcpOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpOcpDashboardTab.services,
};

export const networkWidget: GcpOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpOcpDashboardTab.services,
  //   GcpOcpDashboardTab.accounts,
  //   GcpOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpOcpDashboardTab.services,
};

export const storageWidget: GcpOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.storage,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: messages.Usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpOcpDashboardTab.services,
  //   GcpOcpDashboardTab.accounts,
  //   GcpOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpOcpDashboardTab.projects,
};
