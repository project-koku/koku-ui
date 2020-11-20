import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { ForecastPathsType, ForecastType } from '../../../api/forecasts/forecast';
import { AwsDashboardTab, AwsDashboardWidget } from './awsDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.compute_title',
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'aws_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_dashboard.usage_label',
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
    titleKey: 'aws_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsDashboardTab.instanceType,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.instanceType,
};

export const costSummaryWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.aws,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  details: {
    appNavId: 'aws',
    costKey: 'aws_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: paths.awsDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'aws_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [AwsDashboardTab.services, AwsDashboardTab.accounts, AwsDashboardTab.regions],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.services,
};

export const databaseWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.database_title',
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.database,
  details: {
    costKey: 'aws_dashboard.cost_label',
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
    titleKey: 'aws_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsDashboardTab.services,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.services,
};

export const networkWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.network_title',
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.network,
  details: {
    costKey: 'aws_dashboard.cost_label',
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
    titleKey: 'aws_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsDashboardTab.services,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.services,
};

export const storageWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.storage_title',
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.storage,
  details: {
    costKey: 'aws_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'aws_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsDashboardTab.services,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.accounts,
};
