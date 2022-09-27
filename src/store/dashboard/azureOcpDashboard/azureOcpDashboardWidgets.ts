import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/views/components/charts/common/chartDatum';
import { azureDashboardWidgets } from 'store/dashboard/azureDashboard';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatUnits } from 'utils/format';

import { AzureOcpDashboardTab, AzureOcpDashboardWidget } from './azureOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureOcpDashboardWidget = {
  availableTabs: [
    AzureOcpDashboardTab.service_names,
    AzureOcpDashboardTab.subscription_guids,
    AzureOcpDashboardTab.resource_locations,
  ],
  chartName: 'azureOcpCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: AzureOcpDashboardTab.service_names,
  id: getId(),
  titleKey: messages.azureOcpDashboardCostTitle,
  forecastPathsType: ForecastPathsType.azureOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.cost,
  details: {
    costKey: messages.cost,
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.azureDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.azureCostTrendTitle,
  },
};

export const databaseWidget: AzureOcpDashboardWidget = {
  chartName: 'azureOcpDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
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
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: AzureOcpDashboardWidget = {
  chartName: 'azureOcpNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
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
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: AzureOcpDashboardWidget = {
  chartName: 'azureOcpStorageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.storage,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
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
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const virtualMachineWidget: AzureOcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'azureOcpComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.azureComputeTitle,
  reportPathsType: ReportPathsType.azureOcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
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
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};
