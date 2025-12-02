import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import { type HistoricalDataWidget, HistoricalDataWidgetType } from '../common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'gcpCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: HistoricalDataWidget = {
  chartName: 'gcpComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: HistoricalDataWidget = {
  chartName: 'gcpStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
