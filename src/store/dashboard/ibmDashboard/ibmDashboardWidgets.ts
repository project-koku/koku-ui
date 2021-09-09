import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { IbmDashboardTab, IbmDashboardWidget } from './ibmDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: IbmDashboardWidget = {
  id: getId(),
  titleKey: messages.IBMComputeTitle,
  forecastPathsType: ForecastPathsType.ibm,
  reportPathsType: ReportPathsType.ibm,
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
  //   IbmDashboardTab.instanceType,
  //   IbmDashboardTab.accounts,
  //   IbmDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: IbmDashboardTab.instanceType,
};

export const costSummaryWidget: IbmDashboardWidget = {
  id: getId(),
  titleKey: messages.IBMCostTitle,
  forecastPathsType: ForecastPathsType.ibm,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.Cost,
    showHorizontal: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
    viewAllPath: paths.ibmDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.IBMDailyCostTrendTitle,
    titleKey: messages.IBMCostTrendTitle,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
  },
  availableTabs: [IbmDashboardTab.services, IbmDashboardTab.projects, IbmDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: IbmDashboardTab.services,
};

export const databaseWidget: IbmDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.ibm,
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
  //   IbmDashboardTab.services,
  //   IbmDashboardTab.accounts,
  //   IbmDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: IbmDashboardTab.services,
};

export const networkWidget: IbmDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.ibm,
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
  //   IbmDashboardTab.services,
  //   IbmDashboardTab.accounts,
  //   IbmDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: IbmDashboardTab.services,
};

export const storageWidget: IbmDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.ibm,
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
  //   IbmDashboardTab.services,
  //   IbmDashboardTab.accounts,
  //   IbmDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: IbmDashboardTab.projects,
};
