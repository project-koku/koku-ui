import { AwsReportType } from 'api/reports/awsReports';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import {
  DashboardChartType,
  DashboardPerspective,
} from 'store/dashboard/common/dashboardCommon';
import { AwsDashboardTab, AwsDashboardWidget } from './awsDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.compute_title',
  reportType: AwsReportType.instanceType,
  details: {
    costKey: 'aws_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_dashboard.usage_label',
  },
  filter: {
    service: 'AmazonEC2',
  },
  isUsageFirst: true,
  tabsFilter: {
    service: 'AmazonEC2',
  },
  trend: {
    comparison: ChartComparison.usage,
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
  perspective: DashboardPerspective.aws,
};

export const costSummaryWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.cost_title',
  reportType: AwsReportType.cost,
  details: {
    costKey: 'aws_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  isDetailsLink: true,
  isHorizontal: true,
  tabsFilter: {
    limit: 3,
  },
  trend: {
    formatOptions: {},
    titleKey: 'aws_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.services,
  perspective: DashboardPerspective.aws,
};

export const databaseWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.database_title',
  reportType: AwsReportType.database,
  details: {
    costKey: 'aws_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  tabsFilter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  trend: {
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
  perspective: DashboardPerspective.aws,
};

export const networkWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.network_title',
  reportType: AwsReportType.network,
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
  perspective: DashboardPerspective.aws,
};

export const storageWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.storage_title',
  reportType: AwsReportType.storage,
  details: {
    costKey: 'aws_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
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
  perspective: DashboardPerspective.aws,
};
