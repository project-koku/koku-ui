import { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';

import { routes } from '../../../routes';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from '../../../routes/components/charts/common/chartDatum';
import { ComputedForecastItemType } from '../../../routes/components/charts/common/chartDatumForecast';
import { formatCurrency, formatUnits } from '../../../utils/format';
import { formatPath } from '../../../utils/paths';
import { DashboardChartType, type DashboardWidget } from '../common/dashboardCommon';
import { OcpDashboardTab } from './ocpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
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
    costKey: messages.cost,
    showHorizontal: true,
    showTooltip: true,
    viewAllPath: formatPath(routes.ocpDetails.path),
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedForecastInfrastructureItem: ComputedForecastItemType.infrastructure,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    costDistribution: ComputedReportItemValueType.distributed,
    dailyTitleKey: messages.ocpDashboardDailyCostTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.ocpDashboardCostTrendTitle,
  },
  tabsFilter: {
    limit: 3,
  },
};

export const cpuWidget: DashboardWidget = {
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

export const memoryWidget: DashboardWidget = {
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

export const optimizationsWidget: DashboardWidget = {
  id: getId(),
  titleKey: messages.optimizations,
  details: {
    showOptimizations: true,
  },
};

export const volumeWidget: DashboardWidget = {
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
