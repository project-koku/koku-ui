import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AzureOcpDashboardTab, AzureOcpDashboardWidget } from './azureOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureOcpDashboardWidget = {
  id: getId(),
  titleKey: 'azure_ocp_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.azureOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.cost,
  details: {
    costKey: 'cost',
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
    dailyTitleKey: 'azure_ocp_dashboard.daily_cost_trend_title',
    titleKey: 'azure_ocp_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureOcpDashboardTab.service_names,
    AzureOcpDashboardTab.subscription_guids,
    AzureOcpDashboardTab.resource_locations,
  ],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AzureOcpDashboardTab.service_names,
};

export const databaseWidget: AzureOcpDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.database_title',
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.database,
  details: {
    costKey: 'cost',
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
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureOcpDashboardTab.service_names,
  //   AzureOcpDashboardTab.subscription_guids,
  //   AzureOcpDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureOcpDashboardTab.service_names,
};

export const networkWidget: AzureOcpDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.network_title',
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.network,
  details: {
    costKey: 'cost',
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
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureOcpDashboardTab.service_names,
  //   AzureOcpDashboardTab.subscription_guids,
  //   AzureOcpDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureOcpDashboardTab.service_names,
};

export const storageWidget: AzureOcpDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.storage_title',
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.storage,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
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
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureOcpDashboardTab.service_names,
  //   AzureOcpDashboardTab.subscription_guids,
  //   AzureOcpDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureOcpDashboardTab.subscription_guids,
};

export const virtualMachineWidget: AzureOcpDashboardWidget = {
  id: getId(),
  titleKey: 'azure_ocp_dashboard.compute_title',
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
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
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureOcpDashboardTab.instanceType,
  //   AzureOcpDashboardTab.subscription_guids,
  //   AzureOcpDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureOcpDashboardTab.instanceType,
};
