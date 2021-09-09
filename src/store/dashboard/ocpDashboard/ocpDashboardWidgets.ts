import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

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
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    valueFormatterOptions: {},
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    valueFormatterOptions: {},
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.dailyTrend, // No longer showing infrastructure via DashboardChartType.dailyCost
  currentTab: OcpDashboardTab.projects,
};

export const cpuWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCPUUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  details: {
    requestValueFormatterOptions: {
      fractionDigits: 0,
    },
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.usage,
  currentTab: OcpDashboardTab.projects,
};

export const memoryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPMemoryUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  details: {
    requestValueFormatterOptions: {
      fractionDigits: 0,
    },
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.usage,
  currentTab: OcpDashboardTab.projects,
};

export const volumeWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPVolumeUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  details: {
    requestValueFormatterOptions: {
      fractionDigits: 0,
    },
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.usage,
  currentTab: OcpDashboardTab.projects,
};
