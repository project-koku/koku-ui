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
import { awsDashboardWidgets } from '../awsDashboard';
import { azureDashboardWidgets } from '../azureDashboard';
import { DashboardChartType, type DashboardWidget } from '../common/dashboardCommon';
import { gcpDashboardWidgets } from '../gcpDashboard';
import { OcpCloudDashboardTab } from './ocpCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
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

export const computeWidget: DashboardWidget = {
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
    service:
      'AmazonEC2,' + // AWS
      'Virtual Machines,' + // Azure
      'Compute Engine', // GCP
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const databaseWidget: DashboardWidget = {
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

export const networkWidget: DashboardWidget = {
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

export const storageWidget: DashboardWidget = {
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
