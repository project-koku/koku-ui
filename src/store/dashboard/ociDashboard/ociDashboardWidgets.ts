import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'pages/views/components/charts/common/chartDatumUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatUnits } from 'utils/format';

import { OciDashboardTab, OciDashboardWidget } from './ociDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OciDashboardWidget = {
  id: getId(),
  titleKey: messages.ociDashboardCostTitle,
  forecastPathsType: ForecastPathsType.oci,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.cost,
    showHorizontal: true,
    viewAllPath: paths.ociDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.ociDailyCostTrendTitle,
    titleKey: messages.ociCostTrendTitle,
    type: ChartType.rolling,
  },
  availableTabs: [OciDashboardTab.service_names, OciDashboardTab.payer_tenant_ids, OciDashboardTab.resource_locations],
  chartType: DashboardChartType.dailyTrend,
  currentTab: OciDashboardTab.service_names,
};

export const databaseWidget: OciDashboardWidget = {
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.oci,
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
    titleKey: messages.dashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
};

export const networkWidget: OciDashboardWidget = {
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.oci,
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
    titleKey: messages.dashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
};

export const storageWidget: OciDashboardWidget = {
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.oci,
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
    titleKey: messages.dashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  chartType: DashboardChartType.trend,
};

export const virtualMachineWidget: OciDashboardWidget = {
  id: getId(),
  titleKey: messages.ociComputeTitle,
  reportPathsType: ReportPathsType.oci,
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
    titleKey: messages.dashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  chartFormatter: formatUnits,
  chartType: DashboardChartType.trend,
};
