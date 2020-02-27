import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import {
  OcpUsageDashboardTab,
  OcpUsageDashboardWidget,
} from './ocpUsageDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cost_title',
  reportType: OcpReportType.cost,
  details: {
    costKey: 'ocp_usage_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  isDetailsLink: true,
  isHorizontal: true,
  trend: {
    formatOptions: {},
    titleKey: 'ocp_usage_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpUsageDashboardTab.projects, OcpUsageDashboardTab.clusters],
  currentTab: OcpUsageDashboardTab.projects,
};

export const cpuWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cpu_title',
  reportType: OcpReportType.cpu,
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
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_usage_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpUsageDashboardTab.projects, OcpUsageDashboardTab.clusters],
  currentTab: OcpUsageDashboardTab.projects,
};

export const memoryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.memory_title',
  reportType: OcpReportType.memory,
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
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_usage_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpUsageDashboardTab.projects, OcpUsageDashboardTab.clusters],
  currentTab: OcpUsageDashboardTab.projects,
};

export const volumeWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.volume_title',
  reportType: OcpReportType.volume,
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
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_usage_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpUsageDashboardTab.projects, OcpUsageDashboardTab.clusters],
  currentTab: OcpUsageDashboardTab.projects,
};
