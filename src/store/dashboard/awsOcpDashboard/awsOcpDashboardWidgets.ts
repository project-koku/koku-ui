import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AwsOcpDashboardTab, AwsOcpDashboardWidget } from './awsOcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.AWSComputeTitle,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [
  //   AwsOcpDashboardTab.instanceType,
  //   AwsOcpDashboardTab.accounts,
  //   AwsOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsOcpDashboardTab.instanceType,
};

export const costSummaryWidget: AwsOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.AWSOcpDashboardCostTitle,
  forecastPathsType: ForecastPathsType.awsOcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.cost,
  details: {
    costKey: messages.Cost,
    showHorizontal: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    dailyTitleKey: messages.AWSDailyCostTrendTitle,
    titleKey: messages.AWSCostTrendTitle,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
  },
  availableTabs: [AwsOcpDashboardTab.services, AwsOcpDashboardTab.accounts, AwsOcpDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AwsOcpDashboardTab.services,
};

export const databaseWidget: AwsOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
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
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [
  //   AwsOcpDashboardTab.services,
  //   AwsOcpDashboardTab.accounts,
  //   AwsOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsOcpDashboardTab.services,
};

export const networkWidget: AwsOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    service: 'AmazonVPC,AmazonOcpFront,AmazonRoute53,AmazonAPIGateway',
  },
  tabsFilter: {
    service: 'AmazonVPC,AmazonOcpFront,AmazonRoute53,AmazonAPIGateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
    valueFormatterOptions: {},
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [
  //   AwsOcpDashboardTab.services,
  //   AwsOcpDashboardTab.accounts,
  //   AwsOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsOcpDashboardTab.services,
};

export const storageWidget: AwsOcpDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.awsOcp,
  reportType: ReportType.storage,
  details: {
    costKey: messages.Cost,
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageKey: messages.Usage,
    usageValueFormatterOptions: {
      fractionDigits: 0,
    },
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
    valueFormatterOptions: {
      fractionDigits: 2,
    },
  },
  topItems: {
    valueFormatterOptions: {},
  },
  // availableTabs: [
  //   AwsOcpDashboardTab.services,
  //   AwsOcpDashboardTab.accounts,
  //   AwsOcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsOcpDashboardTab.accounts,
};
