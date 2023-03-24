import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import { routes } from 'routes';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  DatumType,
} from 'routes/views/components/charts/common/chartDatum';
import { ComputedForecastItemType } from 'routes/views/components/charts/common/chartDatumForecast';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatUnits } from 'utils/format';
import { formatPath } from 'utils/paths';

import type { GcpDashboardWidget } from './gcpDashboardCommon';
import { GcpDashboardTab } from './gcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: GcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'gcpComputeChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.gcpComputeTitle,
  forecastPathsType: ForecastPathsType.gcp,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.usage,
  },
  filter: {
    service: 'Compute Engine',
  },
  tabsFilter: {
    service: 'Compute Engine',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.rolling,
    titleKey: messages.dashboardDailyUsageComparison,
  },
};

export const costSummaryWidget: GcpDashboardWidget = {
  availableTabs: [GcpDashboardTab.services, GcpDashboardTab.gcpProjects, GcpDashboardTab.regions],
  chartFormatter: formatCurrency,
  chartType: DashboardChartType.dailyTrend,
  chartName: 'gcpCostChart',
  currentTab: GcpDashboardTab.services,
  id: getId(),
  titleKey: messages.gcpCostTitle,
  forecastPathsType: ForecastPathsType.gcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.cost,
    showHorizontal: true,
    viewAllPath: formatPath(routes.gcpDetails.path),
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.gcpDailyCostTrendTitle,
    datumType: DatumType.cumulative,
    titleKey: messages.gcpCostTrendTitle,
  },
};

export const databaseWidget: GcpDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'gcpDatabaseChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardDatabaseTitle,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service: 'Bigtable,Datastore,Database Migrations,Firebase,Firestore,MemoryStore,Spanner,SQL',
  },
  tabsFilter: {
    service: 'Bigtable,Datastore,Database Migrations,Firebase,Firestore,MemoryStore,Spanner,SQL',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const networkWidget: GcpDashboardWidget = {
  chartFormatter: formatCurrency,
  chartName: 'gcpNetworkChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardNetworkTitle,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.cost,
    showUnits: true,
  },
  filter: {
    service:
      'Network,VPC,Firewall,Route,IP,DNS,CDN,NAT,Traffic Director,Service Discovery,Cloud Domains,Private Service Connect,Cloud Armor',
  },
  tabsFilter: {
    service:
      'Network,VPC,Firewall,Route,IP,DNS,CDN,NAT,Traffic Director,Service Discovery,Cloud Domains,Private Service Connect,Cloud Armor',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    datumType: DatumType.cumulative,
    titleKey: messages.dashboardCumulativeCostComparison,
  },
};

export const storageWidget: GcpDashboardWidget = {
  chartFormatter: formatUnits,
  chartName: 'gcpUsageChart',
  chartType: DashboardChartType.trend,
  id: getId(),
  titleKey: messages.dashboardStorageTitle,
  reportPathsType: ReportPathsType.gcp,
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
