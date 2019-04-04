import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { OcpDashboardTab, OcpDashboardWidget } from './ocpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.cost_title',
  reportType: OcpReportType.cost,
  details: {
    formatOptions: {
      fractionDigits: 2,
    },
  },
  isDetailsLink: true,
  isHorizontal: true,
  trend: {
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
  currentTab: OcpDashboardTab.projects,
};

export const cpuWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.cpu_title',
  reportType: OcpReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_dashboard.cpu_request_label',
    unitsKey: 'ocp_dashboard.cpu_usage_label',
  },
  trend: {
    currentRequestLabelKey: 'ocp_dashboard.cpu_requested_label',
    currentTitleKey: 'ocp_dashboard.cpu_current_title',
    currentUsageLabelKey: 'ocp_dashboard.cpu_used_label',
    formatOptions: {
      fractionDigits: 2,
    },
    previousRequestLabelKey: 'ocp_dashboard.cpu_requested_label',
    previousTitleKey: 'ocp_dashboard.cpu_previous_title',
    previousUsageLabel: 'ocp_dashboard.cpu_used_label',
    titleKey: 'ocp_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  currentTab: OcpDashboardTab.projects,
};

export const memoryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.memory_title',
  reportType: OcpReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_dashboard.memory_request_label',
    unitsKey: 'ocp_dashboard.memory_usage_label',
  },
  trend: {
    currentRequestLabelKey: 'ocp_dashboard.memory_requested_label',
    currentTitleKey: 'ocp_dashboard.memory_current_title',
    currentUsageLabelKey: 'ocp_dashboard.memory_used_label',
    formatOptions: {
      fractionDigits: 2,
    },
    previousRequestLabelKey: 'ocp_dashboard.memory_requested_label',
    previousTitleKey: 'ocp_dashboard.memory_previous_title',
    previousUsageLabel: 'ocp_dashboard.memory_used_label',
    titleKey: 'ocp_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  currentTab: OcpDashboardTab.projects,
};

export const volumeWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.volume_title',
  reportType: OcpReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_dashboard.volume_request_label',
    unitsKey: 'ocp_dashboard.volume_usage_label',
  },
  trend: {
    currentRequestLabelKey: 'ocp_dashboard.volume_requested_label',
    currentTitleKey: 'ocp_dashboard.volume_current_title',
    currentUsageLabelKey: 'ocp_dashboard.volume_used_label',
    formatOptions: {
      fractionDigits: 2,
    },
    previousRequestLabelKey: 'ocp_dashboard.volume_requested_label',
    previousTitleKey: 'ocp_dashboard.volume_previous_title',
    previousUsageLabel: 'ocp_dashboard.volume_used_label',
    titleKey: 'ocp_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  currentTab: OcpDashboardTab.projects,
};
