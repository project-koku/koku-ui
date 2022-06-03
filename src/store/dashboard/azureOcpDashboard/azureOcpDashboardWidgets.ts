import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'pages/views/components/charts/common/chartDatumUtils';
import { azureDashboardWidgets } from 'store/dashboard/azureDashboard';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatUnits } from 'utils/format';

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
    service_name: azureDashboardWidgets.databaseWidget.filter.service_name,
  },
  tabsFilter: {
    service_name: azureDashboardWidgets.databaseWidget.tabsFilter.service_name,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
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
    service_name: azureDashboardWidgets.networkWidget.filter.service_name,
  },
  tabsFilter: {
    service_name: azureDashboardWidgets.networkWidget.tabsFilter.service_name,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
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
  chartType: DashboardChartType.trend,
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
  chartFormatter: formatUnits,
  chartType: DashboardChartType.trend,
};
