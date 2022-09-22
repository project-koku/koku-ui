import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import { paths } from 'routes';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'routes/views/components/charts/common/chartDatumUtils';
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
    chartName: 'ociCostChart',
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.ociDailyCostTrendTitle,
    titleKey: messages.ociCostTrendTitle,
    type: ChartType.rolling,
  },
  availableTabs: [OciDashboardTab.product_services, OciDashboardTab.payer_tenant_ids, OciDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: OciDashboardTab.product_services,
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
    product_service:
      'Database,Autonomous Database,Autonomous Data Warehouse,Autonomous Transaction Processing,Autonomous JSON Database,Exadata Database Service,Database Cloud Service,Autonomous Database on Exadata,MySQL HeatWave,NoSQL,Search Service with OpenSearch',
  },
  tabsFilter: {
    product_service:
      'Database,Autonomous Database,Autonomous Data Warehouse,Autonomous Transaction Processing,Autonomous JSON Database,Exadata Database Service,Database Cloud Service,Autonomous Database on Exadata,MySQL HeatWave,NoSQL,Search Service with OpenSearch',
  },
  trend: {
    chartName: 'ociDatabaseChart',
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
    product_service:
      'Network,Virtual Cloud Networks,Networking Gateways,Load Balancers,Site-to-Site VPN,Client-to-Site VPN,FastConnect,Customer-Premises Equipment,DNS Management',
  },
  tabsFilter: {
    product_service:
      'Network,Virtual Cloud Networks,Networking Gateways,Load Balancers,Site-to-Site VPN,Client-to-Site VPN,FastConnect,Customer-Premises Equipment,DNS Management',
  },
  trend: {
    chartName: 'ociNetworkChart',
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
    chartName: 'ociStorageChart',
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
    product_service: 'Compute,Virtual Machines',
  },
  tabsFilter: {
    product_service: 'Compute,Virtual Machines',
  },
  trend: {
    chartName: 'ociComputeChart',
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.dashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  chartFormatter: formatUnits,
  chartType: DashboardChartType.trend,
};
