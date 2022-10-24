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
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatUnits } from 'utils/format';

import type { AwsOcpDashboardWidget } from './awsOcpDashboardCommon';
import { AwsOcpDashboardTab } from './awsOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsOcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'awsOcpComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.awsComputeTitle,
  reportPathsType: ReportPathsType.awsOcp,
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
  tabsFilter: {
    service: 'AmazonEC2',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const costSummaryWidget: AwsOcpDashboardWidget = {
  availableTabs: [AwsOcpDashboardTab.services, AwsOcpDashboardTab.accounts, AwsOcpDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartName: 'awsOcpCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: AwsOcpDashboardTab.services,
  id: getId(),
  titleKey: messages.awsOcpDashboardCostTitle,
  forecastPathsType: ForecastPathsType.awsOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.awsOcp,
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
    dailyTitleKey: messages.awsDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.awsCostTrendTitle,
  },
};

export const databaseWidget: AwsOcpDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'awsOcpDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service: awsDashboardWidgets.databaseWidget.filter.service,
  },
  tabsFilter: {
    service: awsDashboardWidgets.databaseWidget.tabsFilter.service,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: AwsOcpDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'awsOcpNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service: awsDashboardWidgets.networkWidget.filter.service,
  },
  tabsFilter: {
    service: awsDashboardWidgets.networkWidget.tabsFilter.service,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: AwsOcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'awsOcpStorageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.awsOcp,
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
