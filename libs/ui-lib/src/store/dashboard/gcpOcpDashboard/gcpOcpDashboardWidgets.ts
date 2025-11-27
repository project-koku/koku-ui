import { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';

import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from '../../../routes/components/charts/common/chartDatum';
import { ComputedForecastItemType } from '../../../routes/components/charts/common/chartDatumForecast';
import { formatCurrency, formatUnits } from '../../../utils/format';
import { DashboardChartType, type DashboardWidget } from '../common/dashboardCommon';
import { gcpDashboardWidgets } from '../gcpDashboard';
import { GcpOcpDashboardTab } from './gcpOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: DashboardWidget = {
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

export const costSummaryWidget: DashboardWidget = {
  availableTabs: [GcpOcpDashboardTab.services, GcpOcpDashboardTab.gcpProjects, GcpOcpDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartName: 'gcpOcpCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: GcpOcpDashboardTab.services,
  id: getId(),
  titleKey: messages.gcpOcpDashboardCostTitle,
  forecastPathsType: ForecastPathsType.gcpOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.gcpOcp,
  reportType: ReportType.cost,
  details: {
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

export const databaseWidget: DashboardWidget = {
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

export const networkWidget: DashboardWidget = {
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

export const storageWidget: DashboardWidget = {
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
