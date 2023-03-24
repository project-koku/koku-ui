import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/views/components/charts/common/chartDatum';
import { ComputedForecastItemType } from 'routes/views/components/charts/common/chartDatumForecast';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { gcpDashboardWidgets } from 'store/dashboard/gcpDashboard';
import { formatCurrency, formatUnits } from 'utils/format';

import type { GcpOcpDashboardWidget } from './gcpOcpDashboardCommon';
import { GcpOcpDashboardTab } from './gcpOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: GcpOcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'gcpOcpComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.gcpComputeTitle,
  forecastPathsType: ForecastPathsType.gcpOcp,
  reportPathsType: ReportPathsType.gcpOcp,
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

export const costSummaryWidget: GcpOcpDashboardWidget = {
  availableTabs: [GcpOcpDashboardTab.services, GcpOcpDashboardTab.gcpProjects, GcpOcpDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartName: 'gcpOcpCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: GcpOcpDashboardTab.services,
  id: getId(),
  titleKey: messages.gcpCostTitle,
  forecastPathsType: ForecastPathsType.gcpOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.cost,
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.gcpDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.gcpCostTrendTitle,
  },
};

export const databaseWidget: GcpOcpDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'gcpOcpDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service: gcpDashboardWidgets.databaseWidget.filter.service,
  },
  tabsFilter: {
    service: gcpDashboardWidgets.databaseWidget.tabsFilter.service,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: GcpOcpDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'gcpOcpNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service: gcpDashboardWidgets.networkWidget.filter.service,
  },
  tabsFilter: {
    service: gcpDashboardWidgets.networkWidget.tabsFilter.service,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: GcpOcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'gcpOcpStorageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.gcpOcp,
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
