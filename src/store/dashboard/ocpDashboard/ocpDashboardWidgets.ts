import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'pages/views/components/charts/common/chartDatumUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { formatCurrency, formatUnits } from 'utils/format';

import { OcpDashboardTab, OcpDashboardWidget } from './ocpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPDashboardCostTitle,
  forecastPathsType: ForecastPathsType.ocp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.Cost,
    showHorizontal: true,
    showTooltip: true,
    viewAllPath: paths.ocpDetails,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedForecastInfrastructureItem: ComputedForecastItemType.infrastructure,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.OCPDashboardDailyCostTitle,
    titleKey: messages.OCPDashboardCostTrendTitle,
    type: ChartType.rolling,
  },
  tabsFilter: {
    limit: 3,
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartFormatter: formatCurrency,
  chartType: DashboardChartType.dailyTrend, // No longer showing infrastructure via DashboardChartType.dailyCost
  currentTab: OcpDashboardTab.projects,
};

export const cpuWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCPUUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  details: {
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.Usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  chartFormatter: formatUnits,
  chartType: DashboardChartType.usage,
};

export const memoryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPMemoryUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  details: {
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.Usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  chartFormatter: formatUnits,
  chartType: DashboardChartType.usage,
};

export const volumeWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPVolumeUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  details: {
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.Usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  chartFormatter: formatUnits,
  chartType: DashboardChartType.usage,
};
