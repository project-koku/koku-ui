import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import { routes } from 'routes';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/components/charts/common/chartDatum';
import { ComputedForecastItemType } from 'routes/components/charts/common/chartDatumForecast';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatUnits } from 'utils/format';
import { formatPath } from 'utils/paths';

import type { IbmDashboardWidget } from './ibmDashboardCommon';
import { IbmDashboardTab } from './ibmDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: IbmDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ibmComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.ibmComputeTitle,
  forecastPathsType: ForecastPathsType.ibm,
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
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
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const costSummaryWidget: IbmDashboardWidget = {
  availableTabs: [IbmDashboardTab.services, IbmDashboardTab.projects, IbmDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartName: 'ibmCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: IbmDashboardTab.services,
  id: getId(),
  titleKey: messages.ibmCostTitle,
  forecastPathsType: ForecastPathsType.ibm,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  details: {
    costKey: messages.cost,
    showHorizontal: true,
    viewAllPath: formatPath(routes.ibmDetails.path),
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.ibmDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.ibmCostTrendTitle,
  },
};

export const databaseWidget: IbmDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'ibmDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
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
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: IbmDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'ibmNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
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
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: IbmDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ibmStorageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.storage,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};
