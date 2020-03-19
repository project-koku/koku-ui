import { ReportType } from 'api/reports/report';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import {
  OcpCloudDashboardTab,
  OcpCloudDashboardWidget,
} from './ocpCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_cloud_dashboard.cost_title',
  reportType: ReportType.cost,
  details: {
    costKey: 'ocp_cloud_dashboard.cumulative_cost_label',
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
    titleKey: 'ocp_cloud_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    OcpCloudDashboardTab.services,
    OcpCloudDashboardTab.accounts,
    OcpCloudDashboardTab.regions,
  ],
  chartType: DashboardChartType.trend,
  currentTab: OcpCloudDashboardTab.services,
};

// Cloud widgets

export const computeWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_cloud_dashboard.compute_title',
  reportType: ReportType.instanceType,
  details: {
    costKey: 'ocp_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_cloud_dashboard.usage_label',
  },
  isUsageFirst: true,
  filter: {
    service: 'AmazonEC2',
  },
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_cloud_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.trend,
};

export const databaseWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_cloud_dashboard.database_title',
  reportType: ReportType.database,
  details: {
    costKey: 'ocp_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB' +
      'Database,Cosmos DB,Cache for Redis',
  },
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'ocp_cloud_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
};

export const networkWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_cloud_dashboard.network_title',
  reportType: ReportType.network,
  details: {
    costKey: 'ocp_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway' +
      'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'ocp_cloud_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
};

export const storageWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_cloud_dashboard.storage_title',
  reportType: ReportType.storage,
  details: {
    costKey: 'ocp_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_cloud_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_cloud_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.trend,
};
