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
    database_services:
      'Autonomous Database,Autonomous Data Warehouse,Autonomous Transaction Processing,Autonomous JSON Database,Exadata Database Service,Database Cloud Service,Autonomous Database on Exadata,MySQL HeatWave,NoSQL,Search Service with OpenSearch',
  },
  tabsFilter: {
    database_services:
      'Autonomous Database,Autonomous Data Warehouse,Autonomous Transaction Processing,Autonomous JSON Database,Exadata Database Service,Database Cloud Service,Autonomous Database on Exadata,MySQL HeatWave,NoSQL,Search Service with OpenSearch',
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
    network_services:
      'Virtual Cloud Networks,Networking Gateways,Load Balancers,Site-to-Site VPN,Client-to-Site VPN,FastConnect,Customer-Premises Equipment,DNS Management',
  },
  tabsFilter: {
    network_services:
      'Virtual Cloud Networks,Networking Gateways,Load Balancers,Site-to-Site VPN,Client-to-Site VPN,FastConnect,Customer-Premises Equipment,DNS Management',
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
    product_service: 'Virtual Machines',
  },
  tabsFilter: {
    product_service: 'Virtual Machines',
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
