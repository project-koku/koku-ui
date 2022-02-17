import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'pages/views/components/charts/common/chartDatumUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AzureOcpDashboardTab, AzureOcpDashboardWidget } from './azureOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.AzureOcpDashboardCostTitle,
  forecastPathsType: ForecastPathsType.azureOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.cost,
  details: {
    costKey: messages.Cost,
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.AzureDailyCostTrendTitle,
    titleKey: messages.AzureCostTrendTitle,
    type: ChartType.rolling,
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
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
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
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
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
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.storage,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
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
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
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
  titleKey: messages.AzureComputeTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
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
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  // availableTabs: [
  //   AzureOcpDashboardTab.instanceType,
  //   AzureOcpDashboardTab.subscription_guids,
  //   AzureOcpDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureOcpDashboardTab.instanceType,
};
