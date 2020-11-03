import { ReportPathsType, ReportType } from 'api/reports/report';
import { ChartType, ComputedReportItemType, ComputedReportItemValueType } from 'components/charts/common/chartUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { GcpDashboardTab, GcpDashboardWidget } from './gcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.compute_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'gcp_dashboard.usage_label',
  },
  filter: {
    service: 'AmazonEC2',
  },
  tabsFilter: {
    service: 'AmazonEC2',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'gcp_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.instanceType,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.instanceType,
};

export const costSummaryWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.cost_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  details: {
    appNavId: 'gcp',
    costKey: 'gcp_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: paths.gcpDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'gcp_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [GcpDashboardTab.services, GcpDashboardTab.accounts, GcpDashboardTab.regions],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const databaseWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.database_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.database,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service: 'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  tabsFilter: {
    service: 'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'gcp_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const networkWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.network_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.network,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
  },
  tabsFilter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'gcp_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const storageWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.storage_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.storage,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'gcp_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'gcp_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.accounts,
};
