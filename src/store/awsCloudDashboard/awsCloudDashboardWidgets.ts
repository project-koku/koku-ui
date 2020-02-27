import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import {
  AwsCloudDashboardTab,
  AwsCloudDashboardWidget,
} from './awsCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.compute_title',
  reportType: AwsReportType.instanceType,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_cloud_dashboard.usage_label',
  },
  filter: {
    service: 'AmazonEC2',
  },
  isUsageFirst: true,
  tabsFilter: {
    service: 'AmazonEC2',
  },
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'aws_cloud_dashboard.compute_trend_title',
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
  currentTab: AwsCloudDashboardTab.instanceType,
};

export const costSummaryWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.cost_title',
  reportType: AwsReportType.cost,
  details: {
    costKey: 'aws_cloud_dashboard.cumulative_cost_label',
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
    titleKey: 'aws_cloud_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsCloudDashboardTab.services,
    AwsCloudDashboardTab.accounts,
    AwsCloudDashboardTab.regions,
  ],
  currentTab: AwsCloudDashboardTab.services,
};

export const databaseWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.database_title',
  reportType: AwsReportType.database,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
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
    titleKey: 'aws_cloud_dashboard.database_trend_title',
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
  currentTab: AwsCloudDashboardTab.services,
};

export const networkWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.network_title',
  reportType: AwsReportType.network,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
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
    titleKey: 'aws_cloud_dashboard.network_trend_title',
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
  currentTab: AwsCloudDashboardTab.services,
};

export const storageWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.storage_title',
  reportType: AwsReportType.storage,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_cloud_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'aws_cloud_dashboard.storage_trend_title',
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
  currentTab: AwsCloudDashboardTab.accounts,
};
