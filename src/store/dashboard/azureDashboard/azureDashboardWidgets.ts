import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AzureDashboardTab, AzureDashboardWidget } from './azureDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: messages.AzureDashboardCostTitle,
  forecastPathsType: ForecastPathsType.azure,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.Cost,
    showHorizontal: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
    viewAllPath: paths.azureDetails,
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
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AzureDashboardTab.service_names,
};

export const databaseWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
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
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
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
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
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
  titleKey: messages.AzureComputeTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.instanceType,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.instanceType,
};
