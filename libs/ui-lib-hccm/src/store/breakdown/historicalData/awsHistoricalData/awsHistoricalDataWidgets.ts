import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import { type HistoricalDataWidget, HistoricalDataWidgetType } from '../common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'awsCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: HistoricalDataWidget = {
  chartName: 'awsComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: HistoricalDataWidget = {
  chartName: 'awsStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
