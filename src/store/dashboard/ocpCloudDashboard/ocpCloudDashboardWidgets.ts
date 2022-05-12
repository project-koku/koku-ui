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
import { formatCurrency, formatUnits } from 'utils/format';

import { OcpCloudDashboardTab, OcpCloudDashboardWidget } from './ocpCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCloudDashboardCostTitle,
  forecastPathsType: ForecastPathsType.ocpCloud,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ocpCloud,
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
    dailyTitleKey: messages.OCPCloudDashboardDailyCostTrendTitle,
    titleKey: messages.OCPCloudDashboardCostTrendTitle,
    type: ChartType.rolling,
  },
  availableTabs: [OcpCloudDashboardTab.services, OcpCloudDashboardTab.accounts, OcpCloudDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartType: DashboardChartType.dailyTrend,
  currentTab: OcpCloudDashboardTab.services,
};

// Cloud widgets

export const computeWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCloudDashboardComputeTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
  },
  filter: {
    service: 'AmazonEC2',
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

export const databaseWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
    showUnits: true,
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB' +
      'Database,Cosmos DB,Cache for Redis',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartFormatter: formatUnits,
  chartType: DashboardChartType.trend,
};

export const networkWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
    showUnits: true,
  },
  filter: {
    service:
      'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway' +
      'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartFormatter: formatCurrency,
  chartType: DashboardChartType.trend,
};

export const storageWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.storage,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
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
