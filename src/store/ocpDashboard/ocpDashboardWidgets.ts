import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/commonChart/chartUtils';
import { OcpDashboardTab, OcpDashboardWidget } from './ocpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const chargeSummaryWidget: OcpDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_dashboard.charge_title',
  reportType: OcpReportType.charge,
  details: {
    formatOptions: {
      fractionDigits: 2,
    },
  },
  trend: {
    titleKey: 'ocp_dashboard.charge_trend_title',
    formatOptions: {},
    type: ChartType.rolling,
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
    labelKey: 'ocp_dashboard.cpu_usage_label',
    formatOptions: {
      fractionDigits: 0,
    },
    requestLabelKey: 'ocp_dashboard.cpu_request_label',
  },
  trend: {
    titleKey: 'ocp_dashboard.cpu_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
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
    labelKey: 'ocp_dashboard.memory_usage_label',
    formatOptions: {
      fractionDigits: 0,
    },
    requestLabelKey: 'ocp_dashboard.memory_request_label',
  },
  trend: {
    titleKey: 'ocp_dashboard.memory_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpDashboardTab.projects, OcpDashboardTab.clusters],
  currentTab: OcpDashboardTab.projects,
};
