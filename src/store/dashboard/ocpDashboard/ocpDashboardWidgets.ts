import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import { paths } from 'routes';
import {
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/views/components/charts/common/chartDatum';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatUnits } from 'utils/format';

import { OcpDashboardTab, OcpDashboardWidget } from './ocpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpDashboardWidget = {
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartFormatter: formatCurrency,
  chartName: 'ocpCostChart',
  chartType: DashboardChartType.dailyTrend, // No longer showing infrastructure via DashboardChartType.dailyCost
  currentTab: OcpDashboardTab.projects,
  id: getId(),
  titleKey: messages.ocpDashboardCostTitle,
  forecastPathsType: ForecastPathsType.ocp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.cost,
    showHorizontal: true,
    showTooltip: true,
    viewAllPath: paths.ocpDetails,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedForecastInfrastructureItem: ComputedForecastItemType.infrastructure,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.ocpDashboardDailyCostTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.ocpDashboardCostTrendTitle,
  },
  tabsFilter: {
    limit: 3,
  },
};

export const cpuWidget: OcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ocpCpuChart',
  chartType: DashboardChartType.usage,
  id: getId(),
  titleKey: messages.ocpCpuUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  details: {
    requestKey: messages.requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.ocpDailyUsageAndRequestComparison,
  },
};

export const memoryWidget: OcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ocpMemoryChart',
  chartType: DashboardChartType.usage,
  id: getId(),
  titleKey: messages.ocpMemoryUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  details: {
    requestKey: messages.requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.ocpDailyUsageAndRequestComparison,
  },
};

export const volumeWidget: OcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ocpVolumeChart',
  chartType: DashboardChartType.usage,
  id: getId(),
  titleKey: messages.ocpVolumeUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  details: {
    requestKey: messages.requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.ocpDailyUsageAndRequestComparison,
  },
};
