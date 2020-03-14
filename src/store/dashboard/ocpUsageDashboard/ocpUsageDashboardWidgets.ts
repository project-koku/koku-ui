import { OcpCloudReportType } from 'api/reports/ocpCloudReports';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import {
  DashboardChartType,
  DashboardPerspective,
} from 'store/dashboard/common/dashboardCommon';
import {
  OcpUsageDashboardTab,
  OcpUsageDashboardWidget,
} from './ocpUsageDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cost_title',
  reportType: OcpCloudReportType.cost,
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
  perspective: DashboardPerspective.ocpUsage,
};

export const cpuWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cpu_title',
  reportType: OcpCloudReportType.cpu,
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
  perspective: DashboardPerspective.ocpUsage,
};

export const memoryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.memory_title',
  reportType: OcpCloudReportType.memory,
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
  perspective: DashboardPerspective.ocpUsage,
};

export const volumeWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.volume_title',
  reportType: OcpCloudReportType.volume,
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
  perspective: DashboardPerspective.ocpUsage,
};
