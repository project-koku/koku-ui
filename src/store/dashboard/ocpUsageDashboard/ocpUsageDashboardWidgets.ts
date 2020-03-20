import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import {
  OcpUsageDashboardTab,
  OcpUsageDashboardWidget,
} from './ocpUsageDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cost_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  details: {
    costKey: 'ocp_usage_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  isDetailsLink: true,
  isHorizontal: true,
  tabsFilter: {
    limit: 3,
  },
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'ocp_usage_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpUsageDashboardTab.projects, OcpUsageDashboardTab.clusters],
  chartType: DashboardChartType.trend,
  currentTab: OcpUsageDashboardTab.projects,
};

export const cpuWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cpu_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_usage_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_usage_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_usage_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};

export const memoryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.memory_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_usage_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_usage_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_usage_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};

export const volumeWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.volume_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_usage_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_usage_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_usage_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};
