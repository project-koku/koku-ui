import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedReportItemType,
} from 'components/charts/common/chartUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import {
  AzureDashboardTab,
  AzureDashboardWidget,
} from './azureDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.cost_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  details: {
    appNavId: 'aws',
    costKey: 'aws_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: '/details/azure',
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
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
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.service_names,
};

export const databaseWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.database_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.database,
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
    computedReportItem: ComputedReportItemType.cost,
    formatOptions: {},
    titleKey: 'azure_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.service_names,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.service_names,
};

export const networkWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.network_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.network,
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
    computedReportItem: ComputedReportItemType.cost,
    formatOptions: {},
    titleKey: 'azure_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.service_names,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.service_names,
};

export const storageWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.storage_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  details: {
    costKey: 'azure_dashboard.cost_label',
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
    usageKey: 'azure_dashboard.usage_label',
  },
  filter: {
    service_name: 'Storage',
  },
  tabsFilter: {
    service_name: 'Storage',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'azure_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.service_names,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.subscription_guids,
};

export const virtualMachineWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.compute_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'azure_dashboard.cost_label',
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
    usageKey: 'azure_dashboard.usage_label',
  },
  filter: {
    service_name: 'Virtual Machines',
  },
  tabsFilter: {
    service_name: 'Virtual Machines',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'azure_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.instanceType,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.instanceType,
};
