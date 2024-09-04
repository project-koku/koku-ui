import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import { routes } from 'routes';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/components/charts/common/chartDatum';
import { ComputedForecastItemType } from 'routes/components/charts/common/chartDatumForecast';
import { DashboardChartType, type DashboardWidget } from 'store/dashboard/common/dashboardCommon';
import { formatUnits } from 'utils/format';
import { formatPath } from 'utils/paths';

import { OciDashboardTab } from './ociDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
  availableTabs: [OciDashboardTab.product_services, OciDashboardTab.payer_tenant_ids, OciDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  chartName: 'ociCostChart',
  currentTab: OciDashboardTab.product_services,
  id: getId(),
  titleKey: messages.ociDashboardCostTitle,
  forecastPathsType: ForecastPathsType.oci,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  details: {
    costKey: messages.cost,
    showHorizontal: true,
    viewAllPath: formatPath(routes.ociDetails.path),
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.ociDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.ociCostTrendTitle,
  },
};

export const databaseWidget: DashboardWidget = {
  chartName: 'ociDatabaseChart',
  chartType: DashboardChartType.trend,
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
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: DashboardWidget = {
  chartName: 'ociNetworkChart',
  chartType: DashboardChartType.trend,
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
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: DashboardWidget = {
  chartName: 'ociStorageChart',
  chartType: DashboardChartType.trend,
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
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const virtualMachineWidget: DashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'ociComputeChart',
  chartType: DashboardChartType.trend,
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
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};
