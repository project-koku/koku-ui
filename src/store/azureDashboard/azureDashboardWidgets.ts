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
    costKey: 'azure_dashboard.compute_cost_label',
    formatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'azure_dashboard.compute_usage_label',
  },
  filter: {
    service: 'AmazonEC2',
  },
  tabsFilter: {
    service: 'AmazonEC2',
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
    AzureDashboardTab.accounts,
    AzureDashboardTab.regions,
  ],
  currentTab: AzureDashboardTab.instanceType,
};

export const costSummaryWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.cost_title',
  reportType: AzureReportType.cost,
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
    titleKey: 'azure_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.services,
    AzureDashboardTab.accounts,
    AzureDashboardTab.regions,
  ],
  currentTab: AzureDashboardTab.services,
};

export const databaseWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.database_title',
  reportType: AzureReportType.database,
  details: {
    costKey: 'azure_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  tabsFilter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
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
    AzureDashboardTab.services,
    AzureDashboardTab.accounts,
    AzureDashboardTab.regions,
  ],
  currentTab: AzureDashboardTab.services,
};

export const networkWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.network_title',
  reportType: AzureReportType.network,
  details: {
    costKey: 'azure_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
  },
  tabsFilter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
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
    AzureDashboardTab.services,
    AzureDashboardTab.accounts,
    AzureDashboardTab.regions,
  ],
  currentTab: AzureDashboardTab.services,
};

export const storageWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.storage_title',
  reportType: AzureReportType.storage,
  details: {
    costKey: 'azure_dashboard.storage_cost_label',
    formatOptions: {
      fractionDigits: 0,
    },
    showUnits: true,
    usageKey: 'azure_dashboard.storage_usage_label',
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
    AzureDashboardTab.services,
    AzureDashboardTab.accounts,
    AzureDashboardTab.regions,
  ],
  currentTab: AzureDashboardTab.accounts,
};
