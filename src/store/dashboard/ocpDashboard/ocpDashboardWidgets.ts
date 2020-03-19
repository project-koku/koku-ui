import { ReportType } from 'api/reports/report';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { OcpDashboardTab, OcpDashboardWidget } from './ocpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.cost_title',
  reportType: ReportType.cost,
  details: {
    costKey: 'ocp_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showTooltip: true,
  },
  isDetailsLink: true,
  isHorizontal: true,
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'ocp_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.cost,
  currentTab: OcpDashboardTab.projects,
};

export const cpuWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.cpu_title',
  reportType: ReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.usage,
  currentTab: OcpDashboardTab.projects,
};

export const memoryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.memory_title',
  reportType: ReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.usage,
  currentTab: OcpDashboardTab.projects,
};

export const volumeWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.volume_title',
  reportType: ReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  chartType: DashboardChartType.usage,
  currentTab: OcpDashboardTab.projects,
};
