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
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
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
    showHorizontal: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.GCPDailyCostTrendTitle,
    titleKey: messages.GCPCostTrendTitle,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
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
    showUnits: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
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
    showUnits: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
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
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [
  //   GcpOcpDashboardTab.services,
  //   GcpOcpDashboardTab.accounts,
  //   GcpOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpOcpDashboardTab.projects,
};
