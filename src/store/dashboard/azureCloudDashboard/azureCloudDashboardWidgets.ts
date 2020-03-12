import { AzureReportType } from 'api/reports/azureReports';
import { ChartType } from 'components/charts/common/chartUtils';
import {
  AzureCloudDashboardTab,
  AzureCloudDashboardWidget,
} from './azureCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.cost_title',
  reportType: AzureReportType.cost,
  details: {
    costKey: 'aws_dashboard.cumulative_cost_label',
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
    titleKey: 'azure_cloud_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureCloudDashboardTab.service_names,
    AzureCloudDashboardTab.subscription_guids,
    AzureCloudDashboardTab.resource_locations,
  ],
  currentTab: AzureCloudDashboardTab.service_names,
};

export const databaseWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.database_title',
  reportType: AzureReportType.database,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service_name: 'Database,Cosmos DB,Cache for Redis',
  },
  tabsFilter: {
    service_name: 'Database,Cosmos DB,Cache for Redis',
  },
  trend: {
    formatOptions: {},
    titleKey: 'azure_cloud_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureCloudDashboardTab.service_names,
  //   AzureCloudDashboardTab.subscription_guids,
  //   AzureCloudDashboardTab.resource_locations,
  // ],
  currentTab: AzureCloudDashboardTab.service_names,
};

export const networkWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.network_title',
  reportType: AzureReportType.network,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service_name:
      'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  tabsFilter: {
    service_name:
      'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    formatOptions: {},
    titleKey: 'azure_cloud_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureCloudDashboardTab.service_names,
  //   AzureCloudDashboardTab.subscription_guids,
  //   AzureCloudDashboardTab.resource_locations,
  // ],
  currentTab: AzureCloudDashboardTab.service_names,
};

export const storageWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.storage_title',
  reportType: AzureReportType.storage,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    units: 'gb-mo',
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'azure_cloud_dashboard.usage_label',
  },
  filter: {
    service_name: 'Storage',
  },
  isUsageFirst: true,
  tabsFilter: {
    service_name: 'Storage',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'azure_cloud_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureCloudDashboardTab.service_names,
  //   AzureCloudDashboardTab.subscription_guids,
  //   AzureCloudDashboardTab.resource_locations,
  // ],
  currentTab: AzureCloudDashboardTab.subscription_guids,
};

export const virtualMachineWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.compute_title',
  reportType: AzureReportType.instanceType,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    units: 'vm-hours',
    usageKey: 'azure_cloud_dashboard.usage_label',
  },
  filter: {
    service_name: 'Virtual Machines',
  },
  isUsageFirst: true,
  tabsFilter: {
    service_name: 'Virtual Machines',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'azure_cloud_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureCloudDashboardTab.instanceType,
  //   AzureCloudDashboardTab.subscription_guids,
  //   AzureCloudDashboardTab.resource_locations,
  // ],
  currentTab: AzureCloudDashboardTab.instanceType,
};
