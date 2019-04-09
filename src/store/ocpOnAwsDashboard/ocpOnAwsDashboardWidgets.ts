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
  titleKey: 'ocp_on_aws_dashboard.cost_title',
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
    formatOptions: {},
    titleKey: 'ocp_on_aws_dashboard.cost_trend_title',
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
  titleKey: 'ocp_on_aws_dashboard.cpu_title',
  reportType: OcpOnAwsReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_on_aws_dashboard.cpu_requested_label',
    usageKey: 'ocp_on_aws_dashboard.cpu_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_aws_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
  currentTab: OcpOnAwsDashboardTab.projects,
};

export const memoryWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.memory_title',
  reportType: OcpOnAwsReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_on_aws_dashboard.memory_requested_label',
    usageKey: 'ocp_on_aws_dashboard.memory_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_aws_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
  currentTab: OcpOnAwsDashboardTab.projects,
};

export const volumeWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.volume_title',
  reportType: OcpOnAwsReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_on_aws_dashboard.volume_requested_label',
    usageKey: 'ocp_on_aws_dashboard.volume_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_aws_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
};

// AWS widgets

export const computeWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.compute_title',
  reportType: OcpOnAwsReportType.instanceType,
  details: {
    costKey: 'ocp_on_aws_dashboard.compute_cost_label',
    formatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_on_aws_dashboard.compute_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_aws_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
};

export const databaseWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.database_title',
  reportType: OcpOnAwsReportType.database,
  details: {
    costKey: 'ocp_on_aws_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    product_family: 'Database Instance',
  },
  tabsFilter: {
    product_family: 'Database Instance',
  },
  trend: {
    formatOptions: {},
    titleKey: 'ocp_on_aws_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
};

export const networkWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.network_title',
  reportType: OcpOnAwsReportType.network,
  details: {
    costKey: 'ocp_on_aws_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    product_family: 'Load Balancer-Network',
  },
  tabsFilter: {
    product_family: 'Load Balancer-Network',
  },
  trend: {
    formatOptions: {},
    titleKey: 'ocp_on_aws_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
};

export const storageWidget: OcpOnAwsDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_aws_dashboard.storage_title',
  reportType: OcpOnAwsReportType.storage,
  details: {
    costKey: 'ocp_on_aws_dashboard.storage_cost_label',
    formatOptions: {
      fractionDigits: 0,
    },
    showUnits: true,
    usageKey: 'ocp_on_aws_dashboard.storage_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_aws_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
};
