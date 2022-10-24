import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/views/components/charts/common/chartDatum';
import { awsDashboardWidgets } from 'store/dashboard/awsDashboard';
import { azureDashboardWidgets } from 'store/dashboard/azureDashboard';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { gcpDashboardWidgets } from 'store/dashboard/gcpDashboard';
import { formatCurrency, formatUnits } from 'utils/format';

import type { OcpCloudDashboardWidget } from './ocpCloudDashboardCommon';
import { OcpCloudDashboardTab } from './ocpCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpCloudDashboardWidget = {
  availableTabs: [OcpCloudDashboardTab.services, OcpCloudDashboardTab.accounts, OcpCloudDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartName: 'ocpCloudCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: OcpCloudDashboardTab.services,
  id: getId(),
  titleKey: messages.ocpCloudDashboardCostTitle,
  forecastPathsType: ForecastPathsType.ocpCloud,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ocpCloud,
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
    dailyTitleKey: messages.ocpCloudDashboardDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.ocpCloudDashboardCostTrendTitle,
  },
};

// Cloud widgets

export const computeWidget: OcpCloudDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ocpCloudComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.ocpCloudDashboardComputeTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
  },
  filter: {
    service: 'AmazonEC2',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const databaseWidget: OcpCloudDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ocpCloudDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service:
      awsDashboardWidgets.databaseWidget.filter.service +
      ',' +
      azureDashboardWidgets.databaseWidget.filter.service_name +
      ',' +
      gcpDashboardWidgets.databaseWidget.filter.service,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: OcpCloudDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'ocpCloudNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service:
      awsDashboardWidgets.networkWidget.filter.service +
      ',' +
      azureDashboardWidgets.networkWidget.filter.service_name +
      ',' +
      gcpDashboardWidgets.networkWidget.filter.service,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: OcpCloudDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ocpCloudStorageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.ocpCloud,
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
