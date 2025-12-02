import { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';

import { routes } from '../../../routes';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from '../../../routes/components/charts/common/chartDatum';
import { ComputedForecastItemType } from '../../../routes/components/charts/common/chartDatumForecast';
import { formatUnits } from '../../../utils/format';
import { formatPath } from '../../../utils/paths';
import { DashboardChartType, type DashboardWidget } from '../common/dashboardCommon';
import { AzureDashboardTab } from './azureDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  chartName: 'azureCostChart',
  chartType: DashboardChartType.dailyTrend,
  currentTab: AzureDashboardTab.service_names,
  id: getId(),
  titleKey: messages.azureDashboardCostTitle,
  forecastPathsType: ForecastPathsType.azure,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  details: {
    costKey: messages.cost,
    showHorizontal: true,
    viewAllPath: formatPath(routes.azureDetails.path),
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

export const databaseWidget: DashboardWidget = {
  chartName: 'azureDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
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
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: DashboardWidget = {
  chartName: 'azureNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
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
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: DashboardWidget = {
  chartName: 'azureStorageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const virtualMachineWidget: DashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'azureComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.azureComputeTitle,
  reportPathsType: ReportPathsType.azure,
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
