import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AwsCloudDashboardTab, AwsCloudDashboardWidget } from './awsCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.compute_title',
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_cloud_dashboard.usage_label',
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
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.instanceType,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.instanceType,
};

export const costSummaryWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.awsCloud,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.cost,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: 'aws_cloud_dashboard.daily_cost_trend_title',
    titleKey: 'aws_cloud_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [AwsCloudDashboardTab.services, AwsCloudDashboardTab.accounts, AwsCloudDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AwsCloudDashboardTab.services,
};

export const databaseWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.database_title',
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.database,
  details: {
    costKey: 'cost',
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
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.services,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.services,
};

export const networkWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.network_title',
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.network,
  details: {
    costKey: 'cost',
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
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.services,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.services,
};

export const storageWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.storage_title',
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.storage,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_cloud_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.services,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.accounts,
};
