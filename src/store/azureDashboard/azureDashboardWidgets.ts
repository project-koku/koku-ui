import { AzureReportType } from 'api/azureReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import {
  AzureDashboardTab,
  AzureDashboardWidget,
} from './azureDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.compute_title',
  reportType: AzureReportType.instanceType,
  details: {
    costKey: 'azure_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    units: 'vm-hours',
    usageKey: 'azure_dashboard.usage_label',
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
    titleKey: 'azure_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.instanceType,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  currentTab: AzureDashboardTab.instanceType,
};

export const costSummaryWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.cost_title',
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
    titleKey: 'azure_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  currentTab: AzureDashboardTab.service_names,
};

export const databaseWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.database_title',
  reportType: AzureReportType.database,
  details: {
    costKey: 'azure_dashboard.cost_label',
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
    titleKey: 'azure_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  currentTab: AzureDashboardTab.service_names,
};

export const networkWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.network_title',
  reportType: AzureReportType.network,
  details: {
    costKey: 'azure_dashboard.cost_label',
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
    titleKey: 'azure_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  currentTab: AzureDashboardTab.service_names,
};

export const storageWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.storage_title',
  reportType: AzureReportType.storage,
  details: {
    costKey: 'azure_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    units: 'gb-mo',
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'azure_dashboard.usage_label',
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
    titleKey: 'azure_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  currentTab: AzureDashboardTab.subscription_guids,
};
