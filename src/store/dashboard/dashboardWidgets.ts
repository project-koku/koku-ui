import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { DashboardTab, DashboardWidget } from './dashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: DashboardWidget = {
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
  //   DashboardTab.instanceType,
  //   DashboardTab.accounts,
  //   DashboardTab.regions,
  // ],
  currentTab: DashboardTab.instanceType,
};

export const costSummaryWidget: DashboardWidget = {
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
    DashboardTab.services,
    DashboardTab.accounts,
    DashboardTab.regions,
  ],
  currentTab: DashboardTab.services,
};

export const databaseWidget: DashboardWidget = {
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
  //   DashboardTab.services,
  //   DashboardTab.accounts,
  //   DashboardTab.regions,
  // ],
  currentTab: DashboardTab.services,
};

export const networkWidget: DashboardWidget = {
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
  //   DashboardTab.services,
  //   DashboardTab.accounts,
  //   DashboardTab.regions,
  // ],
  currentTab: DashboardTab.services,
};

export const storageWidget: DashboardWidget = {
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
  //   DashboardTab.services,
  //   DashboardTab.accounts,
  //   DashboardTab.regions,
  // ],
  currentTab: DashboardTab.accounts,
};
