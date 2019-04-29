import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { AwsDashboardTab, AwsDashboardWidget } from './awsDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.compute_title',
  reportType: AwsReportType.instanceType,
  details: {
    costKey: 'aws_dashboard.compute_cost_label',
    formatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_dashboard.compute_usage_label',
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
  availableTabs: [
    AwsDashboardTab.instanceType,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.instanceType,
};

export const costSummaryWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.cost_title',
  reportType: AwsReportType.cost,
  details: {
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
  currentTab: AwsDashboardTab.services,
};

export const databaseWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.database_title',
  reportType: AwsReportType.database,
  details: {
    costKey: 'aws_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
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
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.services,
};

export const networkWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.network_title',
  reportType: AwsReportType.network,
  details: {
    costKey: 'aws_dashboard.database_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
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
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.services,
};

export const storageWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.storage_title',
  reportType: AwsReportType.storage,
  details: {
    costKey: 'aws_dashboard.storage_cost_label',
    formatOptions: {
      fractionDigits: 0,
    },
    showUnits: true,
    usageKey: 'aws_dashboard.storage_usage_label',
  },
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
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.accounts,
};
