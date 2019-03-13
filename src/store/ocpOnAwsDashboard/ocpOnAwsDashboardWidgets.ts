import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import {
  OcpOnAwsDashboardTab,
  OcpOnAwsDashboardWidget,
} from './ocpOnAwsDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.ocp.cost_title',
  reportType: OcpOnAwsReportType.cost,
  details: {
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
    titleKey: 'ocp_on_aws_dashboard.ocp.cost_trend_title',
    formatOptions: {},
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpOnAwsDashboardTab.projects, OcpOnAwsDashboardTab.clusters],
  currentTab: OcpOnAwsDashboardTab.projects,
};

export const cpuWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.ocp.cpu_title',
  reportType: OcpOnAwsReportType.cpu,
  details: {
    labelKey: 'ocp_on_aws_dashboard.ocp.cpu_usage_label',
    formatOptions: {
      fractionDigits: 0,
    },
    requestLabelKey: 'ocp_on_aws_dashboard.ocp.cpu_request_label',
  },
  trend: {
    currentRequestLabelKey: 'ocp_on_aws_dashboard.ocp.cpu_requested_label',
    currentTitleKey: 'ocp_on_aws_dashboard.ocp.cpu_current_title',
    currentUsageLabelKey: 'ocp_on_aws_dashboard.ocp.cpu_used_label',
    formatOptions: {
      fractionDigits: 2,
    },
    previousRequestLabelKey: 'ocp_on_aws_dashboard.ocp.cpu_requested_label',
    previousTitleKey: 'ocp_on_aws_dashboard.ocp.cpu_previous_title',
    previousUsageLabel: 'ocp_on_aws_dashboard.ocp.cpu_used_label',
    type: ChartType.daily,
  },
  currentTab: OcpOnAwsDashboardTab.projects,
};

export const memoryWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.ocp.memory_title',
  reportType: OcpOnAwsReportType.memory,
  details: {
    labelKey: 'ocp_on_aws_dashboard.ocp.memory_usage_label',
    formatOptions: {
      fractionDigits: 0,
    },
    requestLabelKey: 'ocp_on_aws_dashboard.ocp.memory_request_label',
  },
  trend: {
    currentRequestLabelKey: 'ocp_on_aws_dashboard.ocp.memory_requested_label',
    currentTitleKey: 'ocp_on_aws_dashboard.ocp.memory_current_title',
    currentUsageLabelKey: 'ocp_on_aws_dashboard.ocp.memory_used_label',
    formatOptions: {
      fractionDigits: 2,
    },
    previousRequestLabelKey: 'ocp_on_aws_dashboard.ocp.memory_requested_label',
    previousTitleKey: 'ocp_on_aws_dashboard.ocp.memory_previous_title',
    previousUsageLabel: 'ocp_on_aws_dashboard.ocp.memory_used_label',
    type: ChartType.daily,
  },
  currentTab: OcpOnAwsDashboardTab.projects,
};

// AWS widgets

export const computeWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.aws.compute_title',
  reportType: OcpOnAwsReportType.instanceType,
  details: {
    labelKey: 'ocp_on_aws_dashboard.aws.compute_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'ocp_on_aws_dashboard.aws.compute_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
  },
};

export const storageWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.aws.storage_title',
  reportType: OcpOnAwsReportType.storage,
  details: {
    labelKey: 'ocp_on_aws_dashboard.aws.storage_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'ocp_on_aws_dashboard.aws.storage_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
  },
};
