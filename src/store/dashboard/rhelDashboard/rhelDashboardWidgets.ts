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

import type { RhelDashboardWidget } from './rhelDashboardCommon';
import { RhelDashboardTab } from './rhelDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: RhelDashboardWidget = {
  availableTabs: [RhelDashboardTab.projects, RhelDashboardTab.clusters],
  chartFormatter: formatCurrency,
  chartName: 'rhelCostChart',
  chartType: DashboardChartType.dailyTrend, // No longer showing infrastructure via DashboardChartType.dailyCost
  currentTab: RhelDashboardTab.projects,
  id: getId(),
  titleKey: messages.rhelDashboardCostTitle,
  forecastPathsType: ForecastPathsType.rhel,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.cost,
    showHorizontal: true,
    showTooltip: true,
    viewAllPath: formatPath(routes.rhelDetails.path),
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedForecastInfrastructureItem: ComputedForecastItemType.infrastructure,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.rhelDashboardDailyCostTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.rhelDashboardCostTrendTitle,
  },
  tabsFilter: {
    limit: 3,
  },
};

export const cpuWidget: RhelDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'rhelCpuChart',
  chartType: DashboardChartType.usage,
  id: getId(),
  titleKey: messages.rhelCpuUsageAndRequests,
  reportPathsType: ReportPathsType.rhel,
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
    titleKey: messages.rhelDailyUsageAndRequestComparison,
  },
};

export const memoryWidget: RhelDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'rhelMemoryChart',
  chartType: DashboardChartType.usage,
  id: getId(),
  titleKey: messages.rhelMemoryUsageAndRequests,
  reportPathsType: ReportPathsType.rhel,
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
    titleKey: messages.rhelDailyUsageAndRequestComparison,
  },
};

export const volumeWidget: RhelDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'rhelVolumeChart',
  chartType: DashboardChartType.usage,
  id: getId(),
  titleKey: messages.rhelVolumeUsageAndRequests,
  reportPathsType: ReportPathsType.rhel,
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
    titleKey: messages.rhelDailyUsageAndRequestComparison,
  },
};
