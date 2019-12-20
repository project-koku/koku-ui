import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import {
  OcpOnCloudDashboardTab,
  OcpOnCloudDashboardWidget,
} from './ocpOnCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.cost_title',
  reportType: OcpOnCloudReportType.cost,
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
    titleKey: 'ocp_on_cloud_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    OcpOnCloudDashboardTab.projects,
    OcpOnCloudDashboardTab.clusters,
  ],
  currentTab: OcpOnCloudDashboardTab.projects,
};

export const cpuWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.cpu_title',
  reportType: OcpOnCloudReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_on_cloud_dashboard.cpu_requested_label',
    usageKey: 'ocp_on_cloud_dashboard.cpu_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_cloud_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
};

export const memoryWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.memory_title',
  reportType: OcpOnCloudReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_on_cloud_dashboard.memory_requested_label',
    usageKey: 'ocp_on_cloud_dashboard.memory_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_cloud_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
};

export const volumeWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.volume_title',
  reportType: OcpOnCloudReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_on_cloud_dashboard.volume_requested_label',
    usageKey: 'ocp_on_cloud_dashboard.volume_usage_label',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_cloud_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
};

// Cloud widgets

export const computeWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.compute_title',
  reportType: OcpOnCloudReportType.instanceType,
  details: {
    costKey: 'ocp_on_cloud_dashboard.compute_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_on_cloud_dashboard.compute_usage_label',
  },
  isUsageFirst: true,
  filter: {
    service: 'AmazonEC2',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_cloud_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
};

export const databaseWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.database_title',
  reportType: OcpOnCloudReportType.database,
  details: {
    costKey: 'ocp_on_cloud_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
    service_name: 'Database,Cosmos DB,Cache for Redis',
  },
  trend: {
    formatOptions: {},
    titleKey: 'ocp_on_cloud_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
};

export const networkWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.network_title',
  reportType: OcpOnCloudReportType.network,
  details: {
    costKey: 'ocp_on_cloud_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
    service_name:
      'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    formatOptions: {},
    titleKey: 'ocp_on_cloud_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
};

export const storageWidget: OcpOnCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_on_cloud_dashboard.storage_title',
  reportType: OcpOnCloudReportType.storage,
  details: {
    costKey: 'ocp_on_cloud_dashboard.storage_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    usageFormatOptions: {
      fractionDigits: 0,
    },
    showUnits: true,
    usageKey: 'ocp_on_cloud_dashboard.storage_usage_label',
  },
  isUsageFirst: true,
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_on_cloud_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
};
