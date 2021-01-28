import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AzureCloudDashboardTab, AzureCloudDashboardWidget } from './azureCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.azureCloud,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azureCloud,
  reportType: ReportType.cost,
  details: {
    costKey: 'azure_cloud_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: 'azure_cloud_dashboard.daily_cost_trend_title',
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
  chartType: DashboardChartType.dailyTrend,
  currentTab: AzureCloudDashboardTab.service_names,
};

export const databaseWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.database_title',
  reportPathsType: ReportPathsType.azureCloud,
  reportType: ReportType.database,
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
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
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
  chartType: DashboardChartType.trend,
  currentTab: AzureCloudDashboardTab.service_names,
};

export const networkWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.network_title',
  reportPathsType: ReportPathsType.azureCloud,
  reportType: ReportType.network,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service_name: 'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  tabsFilter: {
    service_name: 'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
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
  chartType: DashboardChartType.trend,
  currentTab: AzureCloudDashboardTab.service_names,
};

export const storageWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.storage_title',
  reportPathsType: ReportPathsType.azureCloud,
  reportType: ReportType.storage,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
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
  tabsFilter: {
    service_name: 'Storage',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
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
  chartType: DashboardChartType.trend,
  currentTab: AzureCloudDashboardTab.subscription_guids,
};

export const virtualMachineWidget: AzureCloudDashboardWidget = {
  id: getId(),
  titleKey: 'azure_cloud_dashboard.compute_title',
  reportPathsType: ReportPathsType.azureCloud,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'azure_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
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
  tabsFilter: {
    service_name: 'Virtual Machines',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
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
  chartType: DashboardChartType.trend,
  currentTab: AzureCloudDashboardTab.instanceType,
};
